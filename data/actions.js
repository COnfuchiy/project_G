/**
 * Created by Dima on 05.08.2020.
 */

let plat_counter = setInterval(function () {
    let height = Math.floor(Math.random() * Math.floor(10))*50;
    Crafty.e('2D, DOM, Color,Floor')
        .attr({x: 800, y: height, w: 200, h: 10})
        .color('#2dff00')
        .bind("UpdateFrame",function () {
            this.x=this.x-2;
            if (this.x===-this.w)
                 this.destroy();
        });
    Crafty.e('2D, DOM, Color, GEN_ITEM')
        .attr({x: 890, y: height-20, w: 20, h: 20})
        .color('#261eff')
        .bind("UpdateFrame",function () {
            this.x=this.x-2;
            if (this.x===-this.w)
                this.destroy();
        });
},1000);
