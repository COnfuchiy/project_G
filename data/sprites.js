/**
 * Created by Dima on 05.08.2020.
 */
Crafty.sprite(96,20,"stok/plat.png", {plat:[0,0]});
Crafty.sprite(180,20,"stok/plat2.png", {platx2:[0,0]});
Crafty.sprite(267,20,"stok/plat3.png", {platx3:[0,0]});
Crafty.sprite(354,20,"stok/plat4.png", {platx4:[0,0]});
Crafty.sprite(66,30,"stok/cd.png",{cd:[0,0]});
Crafty.sprite(61,50,"stok/cd-pc.png",{cd_exchanger:[0,0]});
// item sprites
Crafty.sprite(51,40,"sprites/items/cooler.png",{cooler:[0,0]});
Crafty.sprite(57,40,"sprites/items/disk_driver.png",{disk_driver:[0,0]});
Crafty.sprite(37,40,"sprites/items/fdisk.png",{fdisk:[0,0]});
Crafty.sprite(43,40,"sprites/items/fdisk_2.png",{fdisk_2:[0,0]});
Crafty.sprite(68,40,"sprites/items/graphics.png",{graphics:[0,0]});
Crafty.sprite(31,40,"sprites/items/hdd.png",{hdd:[0,0]});
Crafty.sprite(42,40,"sprites/items/headphones.png",{headphones:[0,0]});
Crafty.sprite(38,40,"sprites/items/loudspeaker.png",{loudspeaker:[0,0]});
Crafty.sprite(38,40,"sprites/items/motherboard.png",{motherboard:[0,0]});
Crafty.sprite(40,40,"sprites/items/motherboard_2.png",{motherboard_2:[0,0]});
Crafty.sprite(40,40,"sprites/items/motherboard_3.png",{motherboard_3:[0,0]});
Crafty.sprite(29,40,"sprites/items/mouse.png",{mouse:[0,0]});
Crafty.sprite(40,40,"sprites/items/proc.png",{proc:[0,0]});
Crafty.sprite(40,40,"sprites/items/proc_2.png",{proc_2:[0,0]});
Crafty.sprite(42,40,"sprites/items/proc_3.png",{proc_3:[0,0]});
Crafty.sprite(42,40,"sprites/items/proc_4.png",{proc_4:[0,0]});
Crafty.sprite(59,40,"sprites/items/usb.png",{usb:[0,0]});
Crafty.sprite(47,40,"sprites/items/wired_keyboard.png",{wired_keyboard:[0,0]});
Crafty.sprite(50,60,"sprites/player.png",{player:[0,0]});

// cd num field
Crafty.e('2D, Canvas, cd')
    .attr({x:450, y:525});
let cd_num_text = Crafty.e('2D, DOM, Text')
    .attr({
        x: 790,
        y: 780
    });
cd_num_text.textFont({
    size: '50px',
    weight: 'bold'
});
cd_num_text.text(':'+user_num_cd.toString());
// score field
let score_text = Crafty.e('2D, DOM, Text')
    .attr({
        x: 300,
        y: 780
    });
score_text.textFont({
    size: '50px',
    weight: 'bold'
});
score_text.text('Score:');
// user score number
let user_score_text = Crafty.e('2D, DOM, Text')
    .attr({
        x: 500,
        y: 780
    });
user_score_text.textFont({
    size: '50px',
    weight: 'bold'
});
user_score_text.text(user_score.toString());
let player = Crafty.e('2D, Canvas, Twoway, Gravity,Collision,Motion,player, SpriteAnimation')
    .attr({x: 0, y: 0, z:12, })
    .reel("run", 900, [
        [0, 0], [1, 0], [2, 0],
        [0, 1], [1, 1], [2, 1],
        [0, 2], [1, 2],
    ])
    .animate("run", -1)
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