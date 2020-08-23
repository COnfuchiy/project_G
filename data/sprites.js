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
Crafty.sprite(32,50,"sprites/mobs/robot_1.png",{robot_1:[0,0]});
Crafty.sprite(28,50,"sprites/mobs/yellow_robot_28x50.png",{yellow_robot:[0,0]});
Crafty.sprite(30,50,"sprites/mobs/octopus_30x50.png",{octopus:[0,0]});
Crafty.sprite(26,50,"sprites/mobs/robocat_26x50.png",{robocat:[0,0]});
Crafty.sprite(49,60,"sprites/mobs/skeleton.png",{skeleton:[0,0]});
Crafty.sprite(57,84,"sprites/mobs/cam_shoot.png",{cam:[0,0]});
Crafty.sprite(584,64,"sprites/mobs/laser-evtanazer.png",{laser:[0,6]});
Crafty.sprite(35,52,"sprites/mobs/fly_bot.png",{fly_bot:[0,0]});
Crafty.sprite(211,221,"sprites/mobs/proff_G.png",{proff_G:[0,0]});
Crafty.sprite(62,50,"sprites/items/computer.png",{comp_off:[0,0],comp_on:[1,0]});
Crafty.sprite(800,500,"sprites/fon.png",{fon:[0,0]});
// cd num field
Crafty.e('2D, Canvas, cd')
    .attr({x:450, y:525});
let cd_num_text = setText(790,780,':'+user_num_cd.toString(),{size: '50px',
    weight: 'bold'})
// score field
let score_text = setText(300,780,'Score:',{size: '50px', weight: 'bold'})
// user score number
let user_score_text = setText(500,780,user_score.toString(),{size: '50px', weight: 'bold'})
let player = Crafty.e('2D, Canvas, Twoway, Gravity,Collision,Motion,player, SpriteAnimation')
    .attr({x: 0, y: 0, z:12, })
    .reel("run", 900, [
        [0, 0], [1, 0], [2, 0],
        [0, 1], [1, 1], [2, 1],
        [0, 2], [1, 2],
    ])
    .reel('jump',1,[[1,1]])
    .animate("run", -1)
    .twoway(300,650)
    .gravity('Floor')
    .gravityConst(2050)
    .onHit("Floor", function(e) {
        let to_ground = e[0].obj;
        to_ground.removeComponent('Floor');
        setTimeout(()=>to_ground.addComponent('Floor'),200);
    })
    .bind('LandedOnGround',function () {
        player.animate("run", -1);
    })
    .bind('CheckLanding',function (e) {
        if (player.ay && e.x +10>=player.x+player.w-10 && player.dy>0)
            player.canLand=false;
    })
    .bind('LiftedOffGround',function (e) {
        e.removeComponent('Floor');
        setTimeout(()=>e.addComponent('Floor'),300);
        player.animate('jump',-1)
    });
Crafty.e('2D, Canvas, Color,Floor')
    .attr({x: 0, y: 500, w: document.documentElement.clientWidth, h: 20, z:2})
    .color('#2dff00');
Crafty.e('2D, Canvas, fon') //first fon
    .attr({x: 0, y: 0,z:0})
    .bind('UpdateFrame',function () {
        this.x = this.x - 0.5;
        if (this.x+this.w===0)
            this.x = document.documentElement.clientWidth-300;
    });
Crafty.e('2D, Canvas, fon') //second fon
    .attr({x: document.documentElement.clientWidth-300, y: 0,z:0})
    .bind('UpdateFrame',function () {
        this.x = this.x - 0.5;
        if (this.x+this.w===0)
            this.x = document.documentElement.clientWidth-300;
    });