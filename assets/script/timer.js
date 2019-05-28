import {timer} from 'rxjs';
import {take} from 'rxjs/operators';
import {subtract, divide} from 'lodash';
cc.Class({
    extends: cc.Component,

    properties: {
        barColor: {
            default: [],
            type: [cc.Color]
        },
        progressBarBgNode: {
            default: null,
            type: cc.Node
        },
        progressBarBarNode: {
            default: null,
            type: cc.Node
        },
        countDownNum: {
            default: null,
            type: cc.Label
        }
    },

    onLoad() {
        this.progressBarSprite = this.progressBarBarNode.getComponent(cc.Sprite);

        this.sendPerMiliSecond = 20;
        this.intervalTime = 1000;
        this.totalTime = 15000;


        /**
         * 舉例: 共要跑 15000 ms, 每 20 ms 送一次count(從0開始++), 則總共會 count 15000 / 20 = 750次
         * 共要改變兩種類型顏色: red, green; 所以一個顏色要改變 750 / 2 = 375 次
         */
        this.totalChangeTimes = divide(this.totalTime, this.sendPerMiliSecond);
        this.colorChangeTimes = divide(this.totalChangeTimes, 2);
        this.colorChangeUnitStep = 255 / this.colorChangeTimes;//每count一次,顏色要變化的數值

        /**
         * 要取幾次 Rxjs送出來的數字;
         */
        let takeCount = Math.floor(this.totalTime / this.sendPerMiliSecond);// (millisecond / send frequency)
        let source = timer(0, 20).pipe(take(takeCount + 1));
        source.subscribe(this.onSetTimer.bind(this));
    },

    onSetTimer(evt) {
        let isChangeTimeLabel = (evt * this.sendPerMiliSecond) % this.intervalTime;//確認是否有被1000ms整除
        let unitCount = this.sendPerMiliSecond / this.totalTime;//每一個count要增加的數量
        this.progressBarSprite.fillRange = 1 - unitCount * evt;

        if(isChangeTimeLabel === 0) this.countDownNum.string = divide(subtract(this.totalTime, evt * this.sendPerMiliSecond), this.intervalTime);


        let redGradient = Math.floor(this.colorChangeUnitStep * evt);
        let greenGradient = 255;

        if(redGradient > 255){
            greenGradient = Math.floor(this.colorChangeUnitStep * (this.totalChangeTimes - evt));
            redGradient = 255;
            greenGradient < 0 ? greenGradient = 0 : greenGradient;
        }

        // console.log('red = ' + redGradient + ' green = ' + greenGradient);
        this._setNodeColor(redGradient, greenGradient, 0);

    },

    _setNodeColor(red, green, blue) {
        this.progressBarBgNode.color = cc.color(red, green, blue);
        this.progressBarBarNode.color = cc.color(red, green, blue);
        this.countDownNum.node.color = cc.color(red, green, blue);
    }
});
