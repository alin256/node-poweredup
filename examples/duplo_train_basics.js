const PoweredUP = require("..");
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
        // color.on("rgb", (rgb) => {
        //     console.log(`Color ${rgb.red}, ${rgb.green}, ${rgb.blue}`);
        // });
        const speed = await hub.waitForDeviceAtPort("SPEEDOMETER"); 
        console.log("Connected SPEEDOMETER");
        // speed.on("speed", (speed) => {
        //     console.log(`Speed ${speed.speed}`);
        // });

        const led = await hub.waitForDeviceByType(PoweredUP.Consts.DeviceType.HUB_LED);
        console.log(`Connected led at port ${led.portName}`);
        led.setRGB(0,255,0);

        const speaker = await hub.waitForDeviceByType(PoweredUP.Consts.DeviceType.DUPLO_TRAIN_BASE_SPEAKER);
        console.log(`Connected speaker at port ${speaker.portName}`);
        const legalSounds = [3, 5, 7, 9, 10];

        // for (let i = 0; i<legalSounds.length; ++i){
        //     console.log(`playing ${legalSounds[i]}`);
        //     await speaker.playSound(legalSounds[i]);
        //     await hub.sleep(2000);
        // }

        const legalTones = [1, 2, 3, 5, 7, 9, 10]; 
        for (let i = 0; i<16; ++i){
            console.log(`playing tone ${i}`);
            await speaker.playTone(i);
            await hub.sleep(5000);
        }

        console.log(`playing STATION DEPARTURE`);

        await speaker.playSound(PoweredUP.Consts.DuploTrainBaseSound.STATION_DEPARTURE);
        await hub.sleep(2000);

        console.log(`playing STEAM`);

        await speaker.playSound(PoweredUP.Consts.DuploTrainBaseSound.STEAM);
        await hub.sleep(2000);


    }

});

poweredUP.scan(); // Start scanning for Hubs
console.log("Scanning for Hubs...");

