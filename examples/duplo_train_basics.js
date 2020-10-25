const { connected } = require("process");
const PoweredUP = require("node-poweredup");
const poweredUP = new PoweredUP.PoweredUP();

poweredUP.on("discover", async (hub) => { // Wait to discover a Hub
    console.log(`Discovered ${hub.name}!`);
    
    await hub.connect(); // Connect to the Hub
    console.log("Connected");

    console.log(`Type       ${hub.type}!`);
    console.log(`Harware    ${hub.hardwareVersion}`);
    console.log(`Firmware   ${hub.firmwareVersion}`);
    console.log(`Battery    ${hub.batteryLevel}`);
    console.log(`Ports      ${hub.ports}`);

    if (hub.type === 5){
        const motor = await hub.waitForDeviceAtPort("MOTOR"); 
        console.log("Connected motor");
        motor.setPower(100);
        const color = await hub.waitForDeviceAtPort("COLOR"); 
        console.log("Connected color");
        color.on("rgb", (rgb) => {
            console.log(`Color ${rgb.red}, ${rgb.green}, ${rgb.blue}`);
        });
        const speed = await hub.waitForDeviceAtPort("SPEEDOMETER"); 
        console.log("Connected SPEEDOMETER");
        speed.on("speed", (speed) => {
            console.log(`Speed ${speed.speed}`);
        });

        const led = await hub.waitForDeviceByType(PoweredUP.Consts.DeviceType.HUB_LED);
        console.log("Connected led");
        led.setRGB(0,255,0);

        const speaker = await hub.waitForDeviceByType(PoweredUP.Consts.DeviceType.DUPLO_TRAIN_BASE_SPEAKER);
        console.log("Connected speaker");

    }

});

poweredUP.scan(); // Start scanning for Hubs
console.log("Scanning for Hubs...");

