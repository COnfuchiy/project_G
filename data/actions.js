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

// buttons actions

Platforms.loop();
