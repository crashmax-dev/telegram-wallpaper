!function(t,i){if("object"==typeof exports&&"object"==typeof module)module.exports=i();else if("function"==typeof define&&define.amd)define([],i);else{var s=i();for(var a in s)("object"==typeof exports?exports:t)[a]=s[a]}}(this,(function(){return(()=>{"use strict";var t={};return(()=>{var i=t;Object.defineProperty(i,"__esModule",{value:!0}),i.TWallpaper=void 0;var s=[0,.25,.5,.75,1,1.5,2,2.5,3,3.5,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,18.3,18.6,18.9,19.2,19.5,19.8,20.1,20.4,20.7,21,21.3,21.6,21.9,22.2,22.5,22.8,23.1,23.4,23.7,24,24.3,24.6,24.9,25.2,25.5,25.8,26.1,26.3,26.4,26.5,26.6,26.7,26.8,26.9,27],a=[{x:.8,y:.1},{x:.6,y:.2},{x:.35,y:.25},{x:.25,y:.6},{x:.2,y:.9},{x:.4,y:.8},{x:.65,y:.75},{x:.75,y:.4}];i.TWallpaper=class{constructor(t,i){this.width=50,this.height=50,this.phase=0,this.tail=0,this.scrollTails=50,this.scrollDelta=0,this.scrollTicking=!1,this.frames=[],this.rgb=[],this.curve=s,this.positions=a,this.phases=a.length,this.init(Object.assign({container:t},i))}hexToRgb(t){var i=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);return i?{r:parseInt(i[1],16),g:parseInt(i[2],16),b:parseInt(i[3],16)}:null}getPositions(t){for(var i=[...this.positions];t>0;)i.push(i.shift()),t--;for(var s=[],a=0;a<i.length;a+=2)s.push(i[a]);return s}curPosition(t,i){i%=this.tails;var s=this.getPositions(t%this.phases);if(i){var a=this.getPositions(++t%this.phases),e=(a[0].x-s[0].x)/this.tails,h=(a[0].y-s[0].y)/this.tails,r=(a[1].x-s[1].x)/this.tails,n=(a[1].y-s[1].y)/this.tails,l=(a[2].x-s[2].x)/this.tails,o=(a[2].y-s[2].y)/this.tails,c=(a[3].x-s[3].x)/this.tails,d=(a[3].y-s[3].y)/this.tails;return[{x:s[0].x+e*i,y:s[0].y+h*i},{x:s[1].x+r*i,y:s[1].y+n*i},{x:s[2].x+l*i,y:s[2].y+o*i},{x:s[3].x+c*i,y:s[3].y+d*i}]}return s}changeTail(t){for(this.tail+=t;this.tail>=this.tails;)this.tail-=this.tails,this.phase++,this.phase>=this.phases&&(this.phase-=this.phases);for(;this.tail<0;)this.tail+=this.tails,this.phase--,this.phase<0&&(this.phase+=this.phases)}onWheel(t){this.interval||(this.scrollDelta+=t.deltaY,this.scrollTicking||(requestAnimationFrame((()=>this.drawOnWheel())),this.scrollTicking=!0))}drawOnWheel(){var t=this.scrollDelta/this.scrollTails;if(this.scrollDelta%=this.scrollTails,t=t>0?Math.floor(t):Math.ceil(t)){this.changeTail(t);var i=this.curPosition(this.phase,this.tail);this.drawGradient(i)}this.scrollTicking=!1}drawNextPositionAnimated(t){if(this.frames.length>0){var i=this.frames.shift();this.drawImageData(i)}else clearInterval(this.interval),this.interval=null,t&&t()}getGradientImageData(t){for(var i=this.hctx.createImageData(this.width,this.height),s=i.data,a=0,e=0;e<this.height;e++)for(var h=e/this.height-.5,r=h*h,n=0;n<this.width;n++){for(var l=n/this.width-.5,o=.35*Math.sqrt(l*l+r),c=o*o*.8*8,d=Math.sin(c),p=Math.cos(c),u=Math.max(0,Math.min(1,.5+l*p-h*d)),v=Math.max(0,Math.min(1,.5+l*d+h*p)),m=0,x=0,g=0,y=0,f=0;f<this.rgb.length;f++){var w=u-t[f].x,b=v-t[f].y,I=Math.max(0,.9-Math.sqrt(w*w+b*b));m+=I*=I*I*I,x+=I*this.rgb[f].r/255,g+=I*this.rgb[f].g/255,y+=I*this.rgb[f].b/255}s[a++]=x/m*255,s[a++]=g/m*255,s[a++]=y/m*255,s[a++]=255}return i}drawImageData(t){this.hctx.putImageData(t,0,0),this.ctx.drawImage(this.hc,0,0,this.width,this.height)}drawGradient(t){this.drawImageData(this.getGradientImageData(t))}requestAnimate(){this.raf=requestAnimationFrame((()=>this.doAnimate()))}doAnimate(){var t=+Date.now();if(t-this.timestamp<this.frametime)return this.requestAnimate();this.timestamp=t,this.changeTail(1);var i=this.curPosition(this.phase,this.tail);this.drawGradient(i),this.requestAnimate()}init(t){var{fps:i,blur:s,tails:a,colors:e,pattern:h,opacity:r,animate:n,container:l,scrollAnimate:o}=t;if(this.container=null!=l?l:this.container,!this.container||!e.length)throw new Error("Container or colors do not exist");this.dispose(),this.hc||(this.hc=document.createElement("canvas"),this.hc.width=this.width,this.hc.height=this.height,this.hctx=this.hc.getContext("2d")),this.canvas=document.createElement("canvas"),this.canvas.classList.add("tw-canvas"),this.canvas.width=this.width,this.canvas.height=this.height,this.ctx=this.canvas.getContext("2d"),this.container.appendChild(this.canvas),h&&(this.pattern=document.createElement("div"),this.pattern.classList.add("tw-pattern"),this.updateBlur(s),this.updatePattern(h),this.updateOpacity(r),this.container.appendChild(this.pattern)),this.animate(n),this.updateTails(a),this.updateColors(e),this.updateFrametime(i),this.scrollAnimate(o),this.update()}dispose(){var t;this.hc&&(clearInterval(this.interval),this.interval=null,cancelAnimationFrame(this.raf),this.raf=null,this.canvas.remove(),null===(t=this.pattern)||void 0===t||t.remove(),this.hc.remove(),this.frames=[])}update(){var t=this.curPosition(this.phase,this.tail);this.drawGradient(t)}updateTails(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:90;t>0&&(this.tails=t)}updateFrametime(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:30;this.frametime=1e3/t}updateOpacity(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:.3;this.pattern&&(this.pattern.style.opacity=t.toString())}updatePattern(t){this.pattern&&(this.pattern.style.backgroundImage="url(".concat(t,")"))}updateBlur(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;this.pattern&&(this.pattern.style.filter="blur(".concat(t,"px)"))}updateColors(t){var i=t.reduce(((t,i)=>{var s=this.hexToRgb(i);return s&&t.push(s),t}),[]);if(!(i.length>1&&i.length<5))throw new Error("Required from 1-4 hex colors");this.rgb=i}toNextPosition(t){clearInterval(this.interval),this.animate(!1),this.frames=[];var i=this.getPositions(this.phase%this.phases);this.phase++;for(var s=this.getPositions(this.phase%this.phases),a=27,e=(s[0].x-i[0].x)/a,h=(s[0].y-i[0].y)/a,r=(s[1].x-i[1].x)/a,n=(s[1].y-i[1].y)/a,l=(s[2].x-i[2].x)/a,o=(s[2].y-i[2].y)/a,c=(s[3].x-i[3].x)/a,d=(s[3].y-i[3].y)/a,p=0;p<this.curve.length;p++){var u=[{x:i[0].x+e*this.curve[p],y:i[0].y+h*this.curve[p]},{x:i[1].x+r*this.curve[p],y:i[1].y+n*this.curve[p]},{x:i[2].x+l*this.curve[p],y:i[2].y+o*this.curve[p]},{x:i[3].x+c*this.curve[p],y:i[3].y+d*this.curve[p]}];this.frames.push(this.getGradientImageData(u))}this.interval=setInterval((()=>{this.drawNextPositionAnimated(t)}),this.frametime)}animate(){if(!(!(arguments.length>0&&void 0!==arguments[0])||arguments[0])&&this.raf)return cancelAnimationFrame(this.raf);this.doAnimate()}scrollAnimate(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];document.onwheel=t?t=>this.onWheel(t):null}}})(),t})()}));