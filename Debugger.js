/**
 * @param pjs
 * @return {*}
 * @constructor
 */
function Debugger(pjs){
  var p5 = pjs;
  var strings = [];
  // font?
  var on = true;

  if(arguments.callee.instance){
    return arguments.callee.instance;
  }
  arguments.callee.instance = this;

  this.addString = function(str){
    if(on){
      strings.push(str);
    }
  };

  this.clear = function(){
    strings = [];
  }

  this.setOn = function(o){
    on = o;
  }

  this.isOn = function(){
    return on;
  }

  this.draw = function(){
    var y = 20;
    if(on){
      p5.fill(255, 0, 0);

      for(var i = 0; i < strings.length; i++){
        p5.text(strings[i], 50, y);
        y += 20;
      }
    }
  }
}

Debugger.getInstance = function(pjs){
  var pjsInstance = pjs.Processing.getInstanceById('sketch');
  return new Debugger(pjsInstance);
};