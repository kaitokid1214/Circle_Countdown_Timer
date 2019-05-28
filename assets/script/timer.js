import {timer} from 'rxjs';
import {take} from 'rxjs/operators';

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

        let takeCount = Math.floor(15000 / 30);// (millisecond / fps)
        let source = timer(0, 30).pipe(take(takeCount + 1));
        source.subscribe(this.onSetTimer.bind(this));

        let labelSource = timer(0, 1000).pipe(take(16));
        labelSource.subscribe(this.onSetTimeLabel.bind(this));
    },

    onSetTimer(evt) {
        let unitCount = 30 / 15000;
        this.progressBarSprite.fillRange = 1 - unitCount * evt;
    },

    onSetTimeLabel(evt) {
        let countTime = 15 - evt;
        this.countDownNum.string = countTime;
        if (countTime > 9) {
            this._setNodeColor(2);
        } else if (countTime < 6) {
            this._setNodeColor(0);
        } else {
            this._setNodeColor(1);
        }
    },

    _setNodeColor(colorIndex) {
        this.progressBarBgNode.color = this.barColor[colorIndex];
        this.progressBarBarNode.color = this.barColor[colorIndex];
        this.countDownNum.node.color = this.barColor[colorIndex];
    }
});
