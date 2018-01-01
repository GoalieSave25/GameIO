var gameIO = require( "gameIO" );
var game = new gameIO.game();
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
var material = new game.p2.Material();
game.world.addContactMaterial(new game.p2.ContactMaterial( material, material, {
  restitution : 0.8
}));
var staticRect = function( x, y, width, height ) {
    var body = new game.body( 0 );
    body.addShape( new game.rectangle( width, height ) );
    body.position = [ x, y ];
    body.shapes[ 0 ].material = material;
    return body;
}
var playerNotInteract = new staticRect( 0, 540 - 40, 1920, 150, "#000" );
var playerInteract = new staticRect( 0, 540 - 40 + 70, 1920, 150, "#000" );
playerInteract.shapes[ 0 ].material = undefined;
game.world.addBody( playerInteract );
game.world.addBody( new staticRect( 960 - 40, 0, 150, 1080, "#000" ) );
game.world.addBody( new staticRect( 0, -540 + 40, 1920, 150, "#000" ) );
game.world.addBody( new staticRect( -960 + 40, 0, 150, 1080, "#000" ) );
game.world.addBody( playerNotInteract );
game.world.gravity[ 1 ] = 32 * 50;
game.notUpdatedIsClose = game.isClose = function() { return true; }
game.addType(
    // Type
    "player",
    // Create
    function( obj, extra ) {
        obj.body = new game.body( 1 );
        //obj.body.material = material;
        obj.body.position[ 1 ] = -100;
        var circle = new game.circle( 70 );
        circle.material = material;
        obj.body.addShape( circle );
        obj.playerInput = new game.playerInput();
        obj.needsUpdate = true;
        obj.color = getRandomColor();
        game.world.disableBodyCollision( obj.body, playerNotInteract );
    },
    // Tick Update
    function( obj ) {
        obj.body.angularVelocity = 0;
        obj.body.angularForce = 0;
        obj.playerInput.up ? obj.body.velocity[1] = -900 : 0;
        obj.playerInput.up ? obj.body.position[1] -= 60 : 0;
        obj.playerInput.up = false;
        obj.playerInput.down ? obj.body.velocity[1] = Math.max( obj.body.velocity[1], 1200 ) : 0;
        obj.body.velocity[0] = 0;
        if( obj.body.velocity[1] > 0 && obj.body.position[ 1 ] > 420 ) {
            obj.body.position[1] = 425;
            if( obj.playerInput.down ) {
                obj.body.position[1] = 425 + 35;
            }
            obj.body.velocity[1] = 0;
        }
        obj.playerInput.left ? obj.body.velocity[0] -= 300 : 0;
        obj.playerInput.right ? obj.body.velocity[0] += 300 : 0;
    },
    // Packet Update
    function( obj, packet ) {
    },
    // Add
    function( obj, packet ) {
        packet.color = obj.color;
    }
);
game.addType(
    // Type
    "ball",
    // Create
    function( obj, extra ) {
        obj.body = new game.body( 0.001 );
        obj.body.position = [ ( Math.random() - 0.5 ) * 600, -300 ];
        obj.body.angle = Math.random() * 2 * Math.PI;
        obj.size = 40;
        var circle = new game.circle( 40 );
        circle.material = material;
        obj.body.addShape( circle );
        obj.needsUpdate = true;
    },
    // Tick Update
    function( obj ) {
        if( obj.body.position[ 1 ] > 420 ) {
            obj.body.position[1] = 425;
            obj.body.velocity[1] = 0;
        }
    },
    // Packet Update
    function( obj, packet ) {
    },
    // Add
    function( obj, packet ) {
        packet.size = obj.size;
    }
);
for( var i = 0; i < 70; i++ ) {
    game.create( "ball" );
}
game.wsopen = function( ws ) {
    if( ws.self !== undefined ) {
        ws.currentPackets.push( { type: "setID", id: ws.self.id } );
        return;
    }
    ws.self = game.create( "player" );
    game.broadcast( game.add( ws.self ) );
    ws.currentPackets.push( { type: "setID", id: ws.self.id } );
}
game.addPacketType(
    "updateControls",
    function( packet, ws ) {
        if( ws.self !== undefined ) {
            ws.self.playerInput[ packet.object.key ] = packet.object.state;
        }
    }
);
game.addPacketType(
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
);
game.addCollision( "player", "ball",
    function( player, ball ) {
        ball.body.velocity[ 0 ] *= 0.6;
    }
);
game.start();