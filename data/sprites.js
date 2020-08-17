/**
 * Created by Dima on 05.08.2020.
 */
Crafty.sprite(96,20,"stok/plat.png", {plat:[0,0]});
Crafty.sprite(180,20,"stok/plat2.png", {platx2:[0,0]});
Crafty.sprite(267,20,"stok/plat3.png", {platx3:[0,0]});
Crafty.sprite(354,20,"stok/plat4.png", {platx4:[0,0]});
Crafty.sprite(66,30,"stok/cd.png",{cd:[0,0]});
let user_score=0;
let score_text = Crafty.e('2D, DOM, Text')
    .attr({
        x: 300,
        y: 780
    });
let user_score_text = Crafty.e('2D, DOM, Text')
    .attr({
        x: 500,
        y: 780
    });
user_score_text.textFont({
    size: '50px',
    weight: 'bold'
});
score_text.textFont({
    size: '50px',
    weight: 'bold'
});
score_text.text('Score:');
user_score_text.text(user_score.toString());
let player = Crafty.e('2D, Canvas, Color, Twoway, Gravity,Collision,Motion,player')
    .attr({x: 0, y: 0, z:12, w: 30, h: 30})
    .color('#F00')
    .twoway(400,650)
    .gravity('Floor')
    .gravityConst(2050)
    .onHit("Floor", function(e) {
        // if(e[0].obj.y<this.y)
        //     this.y-=this.y-e[0].obj.y;
        // this.resetMotion();
        let to_ground = e[0].obj;
        to_ground.removeComponent('Floor');
        setTimeout(()=>to_ground.addComponent('Floor'),200);
    });
Crafty.e('2D, Canvas, Color,Floor')
    .attr({x: 0, y: 500, w: document.documentElement.clientWidth, h: 20})
    .color('#2dff00');