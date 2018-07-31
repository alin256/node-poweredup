const LPF2 = require("..");

const lpf2 = new LPF2.LPF2();
lpf2.scan(); // Start scanning for Vernie

console.log("Looking for Vernie and Remote...");

let vernie = null;
let remote = null;

lpf2.on("discover", async (hub) => { // Wait to discover Vernie and Remote

    if (hub.type === LPF2.Consts.Hubs.BOOST_MOVE_HUB) {

        vernie = hub;
        await vernie.connect();
        console.log("Connected to Vernie!");

    } else if (hub.type === LPF2.Consts.Hubs.POWERED_UP_REMOTE) {
        remote = hub;

        remote.on("button", async (button, state) => {
            if (vernie) {
                switch (state) {
                    case LPF2.Consts.ButtonStates.UP: // If up is pressed, move the track forward
                    {
                        vernie.setMotorSpeed(button === "LEFT" ? "A" : "B", 50);
                        break;
                    }
                    case LPF2.Consts.ButtonStates.DOWN: // If down is pressed, move the track backwards
                    {
                        vernie.setMotorSpeed(button === "LEFT" ? "A" : "B", -50);
                        break;
                    }
                    case LPF2.Consts.ButtonStates.RELEASED: // Stop the track when the button is released
                    {
                        if (button !== "GREEN") {
                            vernie.setMotorSpeed(button === "LEFT" ? "A" : "B", 0);
                        }
                        break;
                    }
                    case LPF2.Consts.ButtonStates.STOP: // Move the head left or right when a red button is pressed
                    {
                        await vernie.setMotorAngle("D", 35, button === "LEFT" ? -20 : 20);
                        break;
                    }
                    case LPF2.Consts.ButtonStates.PRESSED: // Fire when the green button is pressed
                    {
                        if (button === "GREEN") {
                            await vernie.setMotorAngle("D", 80, 20);
                            await vernie.setMotorAngle("D", 80, -20);
                        }
                        break;
                    }
                }
            }
        })

        await remote.connect();
        console.log("Connected to Powered Up Remote!");
    }

    if (vernie && remote) {
        const color = Math.floor(Math.random() * 10) + 1;
        vernie.setLEDColor(color);
        remote.setLEDColor(color);
        console.log("You're now ready to go!");
    }
    
});