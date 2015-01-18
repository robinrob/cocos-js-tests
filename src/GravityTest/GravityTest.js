/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
var HIGH_PLAYER = 0;
var LOW_PLAYER = 1;
var STATUS_BAR_HEIGHT = 20.0;
var SPRITE_TAG = 0;

var GravityTestScene = TestScene.extend({
    ctor:function () {
        this._super(true);
        var pongLayer = new PongLayer();
        this.addChild(pongLayer);
    },
    runThisTest:function () {
        cc.director.runScene(this);
    },
    MainMenuCallback:function (sender) {
        this._super(sender);
    }
});

var PongLayer = cc.Layer.extend({
    _mass:null,
    _platforms:[],
    _massStartingVelocity:null,
    _winSize:null,

    ctor:function () {
        this._super();
        this._massStartingVelocity = cc.p(20.0, -100.0);
        this._winSize = cc.director.getWinSize();

        this._mass = Mass.massWithTexture(cc.textureCache.addImage(s_mass));
        this._mass.x = this._winSize.width / 2;
        this._mass.y = this._winSize.height / 2;
        this._mass.setVelocity(this._massStartingVelocity);
        this.addChild(this._mass);

        var platformTexture = cc.textureCache.addImage(s_platform);

        this._platforms = [];

        var platform = Platform.platformWithTexture(platformTexture);
        platform.x = this._winSize.width / 2;
        platform.y = 15;
        this._platforms.push(platform);

        for (var i = 0; i < this._platforms.length; i++) {
            if (!this._platforms[i])
                break;

            this.addChild(this._platforms[i]);
        }

        this.schedule(this.doStep);
    },
    resetAndScoreMassForPlayer:function (player) {
        if (Math.abs(this._mass.getVelocity().y) < 300) {
            this._massStartingVelocity = cc.pMult(this._massStartingVelocity, -1.1);
        } else {
            this._massStartingVelocity = cc.pMult(this._massStartingVelocity, -1);
        }
        this._mass.setVelocity(this._massStartingVelocity);
        this._mass.x = this._winSize.width / 2;
        this._mass.y = this._winSize.height / 2;

        // TODO -- scoring
    },
    doStep:function (delta) {
        this._mass.move(delta);

        for (var i = 0; i < this._platforms.length; i++) {
            if (!this._platforms[i])
                break;

            this._mass.collideWithPlatform(this._platforms[i]);
        }

        if (this._mass.y > this._winSize.height - STATUS_BAR_HEIGHT + this._mass.radius())
            this.resetAndScoreMassForPlayer(LOW_PLAYER);
        else if (this._mass.y < -this._mass.radius())
            this.resetAndScoreMassForPlayer(HIGH_PLAYER);
        this._mass.draw();
    }
});
