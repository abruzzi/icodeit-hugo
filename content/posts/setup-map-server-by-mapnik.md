+++
title = "使用Mapnik搭建GIS服务器"
date = "2014-04-12"
slug = "2014/04/setup-map-server-by-mapnik"
Categories = ["python", "GIS", "JavaScript"]
+++

#### 渲染引擎Mapnik

[上一篇文章](http://icodeit.org/2014/04/intro-map-gis/)中大概介绍了[Mapnik](https://github.com/mapnik)，它是一个渲染引擎，一般开发中都会使用他的python的bind做开发。

Mapnik的文档写的比较详细，我们这里只是做一些必要的介绍，详细的细节可以参看Mapnik在[Github上的文档](https://github.com/mapnik/mapnik/wiki)。

在Mac下，安装Mapnik十分容易，使用brew即可，注意我们在此处带上`--with-postgresql`选项，使得Mapnik可以通过PostGIS来访问数据库：

```sh
brew install mapnik --with-postgresql
```

安装完成之后，可以通过一个小的python脚本来测试：

```python
import mapnik

map = mapnik.Map(256, 256)
map.background = mapnik.Color('red')
map.zoom_all()

mapnik.render_to_file(map, 'red.png', 'png')
```

这段脚本可以在当前目录下生成一个红色的256x256的小图片。好了，有了渲染引擎，我们需要一些数据来进行渲染了。

#### 数据源

最通用的数据格式为Shapefiles，目前有很多的免费地理信息供公共下载，我们可以从[Metro的站点](http://metro.teczno.com/)上下载一些小的数据文件。

```sh
$ wget http://osm-extracted-metros.s3.amazonaws.com/chengdu.osm2pgsql-shapefiles.zip
$ mkdir chengdu
$ cd chengdu
$ unzip chengdu.osm2pgsql-shapefiles.zip
```
这样就得到了一组文件：

```
$ find . -name "*.shp"
./chengdu.osm-line.shp
./chengdu.osm-point.shp
./chengdu.osm-polygon.shp
```

每一个shp文件都会对应几个其他类型的文件，比如投影信息，属性表等。仅仅查看shp的话，有表示所有点的文件chengdu.osm-line.shp，又表示所有线的chengdu.osm-line.shp，以及表示所有面（区域）的chengdu.osm-polygon.shp文件。

有了这些文件，我们就可以做一些测试了，比如我们首先加载所有的线条，并根据这些线条生成一个图层：

```python
import mapnik

map = mapnik.Map(800, 800)
map.background = mapnik.Color('#ffffff')

style = mapnik.Style()
rule = mapnik.Rule()

point_symbolizer = mapnik.PointSymbolizer()
rule.symbols.append(point_symbolizer)

style.rules.append(rule)

map.append_style('default', style)

ds_point = mapnik.Shapefile(file='chengdu.osm-point.shp')
point = mapnik.Layer('point')
point.datasource = ds_point
point.styles.append('default')

map.layers.append(point)
map.zoom_all()

mapnik.render_to_file(map, 'chengdu.png', 'png')
```

可以得到：

![points](/images/2014/04/chengdu-point.png)

这里介绍一下Mapnik中的一些概念：一个Map可以包含若干个层（Layer），每个层可以独立着色，即可以为每个层定制样式（Style），每个样式由若干个规则组成（Rule）。每个规则由是由若干个符号定制。

![lines](/images/2014/04/chengdu-line.png)

如果将两者重叠，则可以得到：

![lines](/images/2014/04/chengdu-point-and-line.png)

```python
polygon_symbolizer = mapnik.PolygonSymbolizer(mapnik.Color('#c8102e'))
polygon_rule.symbols.append(polygon_symbolizer)

ds_polygon = mapnik.Shapefile(file='chengdu.osm-polygon.shp')
polygon = mapnik.Layer('polygon')
polygon.datasource = ds_polygon
polygon.styles.append('polygon')

map.layers.append(polygon)
```

![image](/images/2014/04/chengdu-polygon.png)

将这三个层叠加在一起，会得到最终的结果：

![lines](/images/2014/04/chengdu-point-and-line-and-polygon.png)

#### 数据转化

在进一步之前，我们需要将数据存储在数据库中。我们可以将shapefile通过转化存入到数据库中。PostGIS本身自带了一个用于此作用的工具：`shp2pgsql`。可以通过这个工具来先将shapefile导入到数据库中。也可以直接导入别的开放数据，比如很多OSM格式的数据源，我们此处仅仅简单的从别的数据源将OSM格式的数据下载并导入到PostGIS中。

创建数据库`chengdu`:

```sh
$ createdb chengdu -O gis -E UTF8 -e
CREATE DATABASE chengdu OWNER gis ENCODING 'UTF8';

$ psql -U gis -d chengdu
```

登陆PostGres，然后为数据库`chengdu`启动PostGIS扩展：

```sql
-- Enable PostGIS (includes raster)
CREATE EXTENSION postgis;
-- Enable Topology
CREATE EXTENSION postgis_topology;
-- fuzzy matching needed for Tiger
CREATE EXTENSION fuzzystrmatch;
-- Enable US Tiger Geocoder
CREATE EXTENSION postgis_tiger_geocoder;
```

```sh
$ wget http://osm-extracted-metros.s3.amazonaws.com/chengdu.osm.bz2
$ bunzip2 -d chengdu.osm.bz2
$ osm2pgsql -U gis -d chengdu -s -S ./default.style chengdu.osm
```

这个命令将chengdu.osm导入到了名称为`chengdu`的数据库中。

可以通过SQL命令查看其中的数据：

```sql
select ST_Extent(ST_Transform(way,4326)) from planet_osm_roads;
```

结果如下：

```
                                st_extent                                 
--------------------------------------------------------------------------
 BOX(103.564165069794 30.3634139134986,104.554549945024 30.9869936005376)
(1 row)
```

#### WMS服务器

生成图片之后，我们还需要将这些图片切成瓦片，然后公开给外部以便使用。Mapnik提供了切图的功能，并且还提供一个实现了[WMS协议的服务器](https://github.com/mapnik/OGCServer)，以便使用。

安装这个OGCServer服务器非常容易：

```sh
$ git clone git@github.com:mapnik/OGCServer.git
$ cd OGCServer
$ sudo python setup.py install
```

但是OGCServer的启动，需要一个配置XML配置文件，这个配置文件可以由Mapnik提供的工具集生成：

```sh
$ svn co http://svn.openstreetmap.org/applications/rendering/mapnik/
```

这个svn仓库中包含了众多的小工具，generate_xml.py用于生成Mapnik的样式文件，generate_image.py用于生成图片，generate_tiles.py用于生成众多的瓦片。

此处我们将使用`generate_xml.py`来创建一个地图样式文件，

```sh
$ cd svn.openstreetmap.org/applications/rendering/mapnik/
$ ./generate_xml.py osm.xml chengdu.xml --dbname chengdu --user gis --accept-none
```

generate_xml.py根据osm.xml作为模板，生成`chengdu.xml`。这个文件即可用于测试OGCServer：

```sh
$ OGCServer chengdu.xml
Listening at 0.0.0.0:8000....
```

然后在浏览器中查看：

![ogcserver](/images/2014/04/ogcserver-localhost-resized.png)

#### 使用OpenLayers测试

有了一张图片，那么我们就需要有更多的图片组成的瓦片，这就需要使用引入GIS的前端利器OpenLayers了：

```
$(function() {
    var map, layer;
    map = new OpenLayers.Map('map', {});

    layer = new OpenLayers.Layer.WMS('Tile Cache', 
        'http://localhost:8000/?', {
            layers: '__all__',
            format: 'image/png'
        });
    
    map.addLayer(layer);

    if (!map.getCenter()) {
        map.zoomToMaxExtent();
    }
});
```

![openlayers](/images/2014/04/openlayers-chengdu-resized.png)


![openlayers](/images/2014/04/openlayers-chengdu-detail-resized.png)


应该注意的是，此处在OpenLayers中使用了来自与OSM导入的数据，而并非Shapefile中的数据（Shapefile中仅有三个层次，point, line, polygon）。而OSM的数据则丰富的多。

