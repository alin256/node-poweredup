import { Peripheral } from "@abandonware/noble";

import { IBLEAbstraction } from "../interfaces";

import { LPF2Hub } from "./lpf2hub";

import * as Consts from "../consts";

import Debug = require("debug");
const debug = Debug("ControlPlusHub");


/**
 * The ControlPlusHub is emitted if the discovered device is a Control+ Hub.
 * @class ControlPlusHub
 * @extends LPF2Hub
 * @extends Hub
 */
export class ControlPlusHub extends LPF2Hub {


    public static IsControlPlusHub (peripheral: Peripheral) {
        return (
            peripheral.advertisement &&
            peripheral.advertisement.serviceUuids &&
            peripheral.advertisement.serviceUuids.indexOf(Consts.BLEService.LPF2_HUB.replace(/-/g, "")) >= 0 &&
            peripheral.advertisement.manufacturerData &&
            peripheral.advertisement.manufacturerData.length > 3 &&
            peripheral.advertisement.manufacturerData[3] === Consts.BLEManufacturerData.CONTROL_PLUS_LARGE_HUB
        );
    }

    protected _currentPort = 0x3b;
    protected _currentMaxMA = 4175;
    protected _voltagePort = 0x3c;
    protected _voltageMaxRaw = 4095;
    protected _voltageMaxV = 9.615;

    constructor (device: IBLEAbstraction) {
        super(device, ControlPlusHub.PortMap, Consts.HubType.CONTROL_PLUS_HUB);
        debug("Discovered Control+ Hub");
    }


    public connect () {
        return new Promise(async (resolve, reject) => {
            debug("Connecting to Control+ Hub");
            await super.connect();
            this.send(Buffer.from([0x41, 0x3d, 0x00, 0x0a, 0x00, 0x00, 0x00, 0x01]), Consts.BLECharacteristic.LPF2_ALL); // Temperature
            debug("Connect completed");
            return resolve();
        });
    }


    // /**
    //  * Tell motor to goto an absolute position
    //  * @method ControlPlusHub#setAbsolutePosition
    //  * @param {string} port
    //  * @param {number} pos The position of the motor to go to
    //  * @param {number | Array.<number>} [speed=100] A value between 1 - 100 should be set (Direction does not apply when going to absolute position)
    //  * @returns {Promise} Resolved upon successful completion of command (ie. once the motor is finished).
    //  */
    // public setAbsolutePosition (port: string, pos: number, speed: number = 100) {
    //     const portObj = this._portLookup(port);
    //     if (!(
    //         portObj.type === Consts.DeviceType.CONTROL_PLUS_LARGE_MOTOR ||
    //         portObj.type === Consts.DeviceType.CONTROL_PLUS_XLARGE_MOTOR
    //     )) {
    //         throw new Error("Absolute positioning is only available when using a Control+ Medium Motor, or Control+ Large Motor");
    //     }
    //     portObj.cancelEventTimer();
    //     return new Promise((resolve, reject) => {
    //         portObj.busy = true;
    //         let data = null;
    //         if (this._virtualPorts[portObj.id]) {
    //             data = Buffer.from([0x81, portObj.value, 0x11, 0x0e, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, this._mapSpeed(speed), 0x64, 0x7f, 0x03]);
    //             data.writeInt32LE(pos, 4);
    //             data.writeInt32LE(pos, 8);
    //         } else {
    //             // @ts-ignore: The type of speed is properly checked at the start
    //             data = Buffer.from([0x81, portObj.value, 0x11, 0x0d, 0x00, 0x00, 0x00, 0x00, this._mapSpeed(speed), 0x64, 0x7f, 0x03]);
    //             data.writeInt32LE(pos, 4);
    //         }
    //         this.send(data, Consts.BLECharacteristic.LPF2_ALL);
    //         portObj.finished = () => {
    //             return resolve();
    //         };
    //     });
    // }


    // /**
    //  * Reset the current motor position as absolute position zero
    //  * @method ControlPlusHub#resetAbsolutePosition
    //  * @param {string} port
    //  * @returns {Promise} Resolved upon successful completion of command (ie. once the motor is finished).
    //  */
    // public resetAbsolutePosition (port: string) {
    //     const portObj = this._portLookup(port);
    //     if (!(
    //         portObj.type === Consts.DeviceType.CONTROL_PLUS_LARGE_MOTOR ||
    //         portObj.type === Consts.DeviceType.CONTROL_PLUS_XLARGE_MOTOR
    //     )) {
    //         throw new Error("Absolute positioning is only available when using a Control+ Medium Motor, or Control+ Large Motor");
    //     }
    //     return new Promise((resolve) => {
    //         const data = Buffer.from([0x81, portObj.value, 0x11, 0x51, 0x02, 0x00, 0x00, 0x00, 0x00]);
    //         this.send(data, Consts.BLECharacteristic.LPF2_ALL);
    //         return resolve();
    //     });
    // }


}

export namespace ControlPlusHub {

    export const PortMap: {[portName: string]: number} = {
        "A": 0,
        "B": 1,
        "C": 2,
        "D": 3,
        "ACCEL": 97,
        "GYRO": 98,
        "TILT": 99
    }

}