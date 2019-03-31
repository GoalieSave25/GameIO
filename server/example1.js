var gameIO = require( "gameio" );
var express = require( "express" );
var app = express();
app.get( "/status", function( req, res ) {
	res.send( "ok" );
} );
var game = new gameIO.game( { port : 80, enablews : false, app : app } );
game.addType(
    // Type
    "player",
    // Create
    function( obj, extra ) {
        obj.body = new game.body( 1 );
        obj.body.position = [ ( Math.random() - 0.5 ) * 200, ( Math.random() - 0.5 ) * 200 ];
        obj.body.addShape( new game.rectangle( 70, 70 ) );
        obj.body.damping = 0.5;
        obj.playerInput = new game.playerInput();
        obj.needsUpdate = true;
    },
    // Tick Update
    function( obj ) {
        obj.health = Math.max( Math.min( obj.health + 0.1, 100 ), 0 );
        obj.body.angularVelocity = 0;
        obj.body.angularForce = 0;
        obj.body.velocity[0] *= 0.5;
        obj.body.velocity[1] *= 0.5;
        obj.playerInput.up ? obj.body.velocity[1] = -300 : 0;
        obj.playerInput.down ? obj.body.velocity[1] = 300 : 0;
        obj.playerInput.left ? obj.body.velocity[0] = -300 : 0;
        obj.playerInput.right ? obj.body.velocity[0] = 300 : 0;
    },
    // Packet Update
    function( obj, packet ) {
    },
    // Add
    function( obj, packet ) {
    }
);
game.addType(
    // Type
    "enemy",
    // Create
    function( obj, extra ) {
        obj.body = new game.body( 0.001 );
        obj.body.position = [ ( Math.random() - 0.5 ) * 200, ( Math.random() - 0.5 ) * 200 ];
        obj.body.angle = Math.random() * 2 * Math.PI;
        obj.ttfloat = Math.random() * 24 + 24;
        obj.size = Math.floor( Math.random() * 20 + 20 );
        obj.body.addShape( new game.rectangle( obj.size, obj.size ) );
        obj.body.damping = 0.5;
        obj.needsUpdate = true;
    },
    // Tick Update
    function( obj ) {
    },
    // Packet Update
    function( obj, packet ) {
    },
    // Add
    function( obj, packet ) {
        packet.size = obj.size;
    }
);
for( var i = 0; i < 100; i++ ) {
    game.create( "enemy" );
}
game.wsopen = function( ws ) {
  console.log( "Client Connected" );
    if( ws.self === undefined || ws.self.type == "spectator" )
        ws.self = game.create( "player" );
}
game.wsclose = function( ws ) {
    game.remove( ws.self );
}
game.addPacketType(
    "updateControls",
    function( packet, ws ) {
        if( ws.self !== undefined ) {
            ws.self.playerInput = packet.object;
        }
    }
);
/*game.addPacketType(
    "getObject",
    function( packet, ws ) {
        if( ws.currentPackets === undefined )
            return;
        for( var i = 0; i < game.objects.length; i++ ) {
            if( game.objects[ i ].id == packet.object.id ) {
                ws.currentPackets.push( game.add( game.objects[ i ] ) );
            }
        }
    }
);
game.addPacketType(
    "getID",
    function( packet, ws ) {
        if( ws.self !== undefined )
            ws.currentPackets.push( { type : "setID", id : ws.self.id } );
    }
);*/
game.start();
