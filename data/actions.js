/**
 * Created by Dima on 05.08.2020.
 */
//useless random
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
//hz how is working, but is here
let switch_screen = 0;
Crafty.viewport.scale(1.5);
Crafty.mobile = true;
// window.addEventListener("orientationchange", function() {
//     if (document.documentElement.clientWidth<document.documentElement.clientHeight){
//         Crafty.viewport.scale(0.6);
//         switch_screen = 0;
//     }
//     else {
//         Crafty.viewport.scale(1);
//         switch_screen = 1;
//     }
//
// }, false);
Platforms.loop();

// let plat_counter = setInterval(function () {
//     let height = Math.floor(Math.random() * Math.floor(10))*100;
//     Crafty.e('2D, Canvas, Color,Floor')
//         .attr({x: 800, y: height, w: 800, h: 20})
//         .color('#2dff00')
//         .bind("UpdateFrame",function () {
//             this.x=this.x-4;
//             if (this.x===-this.w)
//                  this.destroy();
//         });
//     Crafty.e('2D, Canvas, Color, GEN_ITEM')
//         .attr({x: 890, y: height-50, w: 50, h: 50})
//         .color('#261eff')
//         .bind("UpdateFrame",function () {
//             this.x=this.x-4;
//             if (this.x===-this.w)
//                 this.destroy();
//         });
// },1000);
