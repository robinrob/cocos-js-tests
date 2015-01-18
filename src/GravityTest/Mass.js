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
var Mass = cc.Sprite.extend({
    _velocity:cc.p(0,0),
    _radius:0,
    radius:function () {
        return this._radius;
    },
    setRadius:function (rad) {
        this._radius = rad;
    },
    move:function (delta) {
        this.x += this._velocity.x * delta;
        this.y += this._velocity.y * delta;
        var winSize = cc.director.getWinSize();
        if (this.x > winSize.width - this.radius()) {
            this.x = winSize.width - this.radius();
        } else if (this.x < this.radius()) {
            this.x = this.radius();
            this._velocity.x *= -1;
        }
//        this._velocity.y *= 0.1;
    },
    collideWithPlatform:function (platform) {
        var platformRect = platform.rect();

        platformRect.x += platform.x;
        platformRect.y += platform.y;

        var lowY = cc.rectGetMinY(platformRect);
        var midY = cc.rectGetMidY(platformRect);
        var highY = cc.rectGetMaxY(platformRect);

        var leftX = cc.rectGetMinX(platformRect);
        var rightX = cc.rectGetMaxX(platformRect);

        if ((this.x > leftX) && (this.x < rightX)) {
            var hit = false;
            var angleOffset = 0.0;
            if ((this.y > midY) && (this.y <= (highY + this.radius()))) {
                this.y = highY + this.radius();
                hit = true;
                angleOffset = Math.PI / 2;
            } else if (this.y < midY && this.y >= lowY - this.radius()) {
                this.y = lowY - this.radius();
                hit = true;
                angleOffset = -Math.PI / 2;
            }

            if (hit) {
                var hitAngle = cc.pToAngle(cc.p(platform.x - this.x, platform.y - this.y)) + angleOffset;

                var scalarVelocity = cc.pLength(this._velocity) * 1.00000005;
                var velocityAngle = -cc.pToAngle(this._velocity) + 0.00000005 * hitAngle;
                //this._velocity = -this._velocity.y;
                this._velocity = cc.pMult(cc.pForAngle(velocityAngle), scalarVelocity);
            }
        }
    },
    setVelocity:function (velocity) {
        this._velocity = velocity;
    },
    getVelocity:function () {
        return this._velocity;
    }
});
Mass.massWithTexture = function (texture) {
    var mass = new Mass();
    mass.initWithTexture(texture);
    if (texture instanceof cc.Texture2D)
        mass.setRadius(texture.width / 2);
    else if ((texture instanceof HTMLImageElement) || (texture instanceof HTMLCanvasElement))
        mass.setRadius(texture.width / 2);
    return mass;
};
