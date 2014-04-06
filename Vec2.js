/**
 * Created by Zachary on 4/6/2014.
 */
Vec2 = function(x,y){
    this.x = x;
    this.y = y;
};

Vec2.prototype = {
    set: function(x,y){
        this.x = x;
        this.y = y;
    }
}