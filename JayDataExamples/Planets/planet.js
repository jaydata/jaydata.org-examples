HTMLElement.prototype.hasClass = function(cls){
    return this.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
};

HTMLElement.prototype.addClass = function(cls){
    if (cls instanceof Array){
        for (var i = 0; i < cls.length; i++){
            if (!this.hasClass(cls[i])) this.className += (' ' + cls[i]);
        }
    }else if (!this.hasClass(cls)) this.className += (' ' + cls);
};

HTMLElement.prototype.removeClass = function(cls){
    if (cls instanceof Array){
        for (var i = 0; i < cls.length; i++){
            if (this.hasClass(cls)) this.className = this.className.replace(new RegExp('(\\s|^)'+cls+'(\\s|$)'), ' ');
        }
    }else if (this.hasClass(cls)) this.className = this.className.replace(new RegExp('(\\s|^)'+cls+'(\\s|$)'), ' ');
};

Math.rand = function(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

if (!Function.prototype.bind){
  Function.prototype.bind = function (oThis){
    if (typeof this !== "function"){
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }  
  
    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function(){},
        fBound = function(){
          return fToBind.apply(this instanceof fNOP
                                 ? this
                                 : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
  
    return fBound;
  };
}

$data.Class.define('$planet.System', null, null, {
    constructor: function(config){
        var container = document.createElement('DIV');
        container.className = 'container' + (config.Speed ? ' rotate' : '');
        container.style.left = config.X + 'px';
        container.style.top = config.Y + 'px';
        container.id = ('system-' + config.Id);

        var rotator = document.createElement('DIV');
        rotator.className = 'rotator' + (config.Distance ? ' rotate' : '');
        if (config.Distance && config.Parent){
            rotator.style.paddingLeft = (config.Distance) + 'px';
            rotator.style.webkitTransformOrigin = (config.Parent.Radius + 8) + 'px ' + (config.Parent.Radius + 8) + 'px';
            rotator.style.paddingTop = (config.Parent.Radius - config.Radius) + 'px';
        }
        rotator.style.webkitAnimationDuration = (config.Speed) + 's';
        rotator.appendChild(container);

        this.el = container;
        ((config.Parent ? config.Parent.el : config.el) || document.body).appendChild(rotator);
        config.el = this.el;
    }
}, null);

$data.Class.define('$planet.Planet', null, null, {
    constructor: function(config){
        var img = document.createElement('DIV');
        img.className = 'planet' + (config.Speed ? ' rotate' : '');
        img.style.webkitBoxShadow = '0 0 ' + config.ShadowBlur + 'px ' + config.ShadowStyle;
        img.style.border = 'solid ' + config.Radius + 'px ' + config.BodyStyle;
        img.style.left = (-config.Radius) + 'px';
        img.style.top = (-config.Radius) + 'px';
        img.planet = config;

        var rotator = document.createElement('DIV');
        rotator.className = 'rotator' + (config.Distance ? ' rotate' : '');
        rotator.planet = config;
        var selector = document.createElement('DIV');
        selector.id = ('planet-' + config.Id);
        selector.className = 'selector';
        selector.planet = config;
        if (config.Distance){
            rotator.style.paddingLeft = (config.Distance) + 'px';
            rotator.style.webkitTransformOrigin = (config.Parent.Radius + 8) + 'px ' + (config.Parent.Radius + 8) + 'px';
            rotator.style.paddingTop = (config.Parent.Radius - config.Radius) + 'px';
        }
        rotator.style.webkitAnimationDuration = (config.Speed) + 's';
        selector.appendChild(img);
        rotator.appendChild(selector);
        ((config.Parent ? config.Parent.el : config.el) || document.body).appendChild(rotator);
    }
}, null);

$data.Class.define('$planet.Application', null, null, {}, {
    init: function(){
        document.getElementById('toggle').addEventListener('click', $planet.Application.togglePlanetsPanel, false);
        document.getElementById('edit').addEventListener('click', $planet.Application.editPlanet, false);
        document.getElementById('save').addEventListener('click', $planet.Application.savePlanet, false);
        document.getElementById('cancel').addEventListener('click', $planet.Application.cancelEditPlanet, false);

        document.getElementById('planet-parent').addEventListener('change', function(){
            document.getElementById('planet-parentid').disabled = !document.getElementById('planet-parentid').disabled;
            document.getElementById('planet-distance').disabled = !document.getElementById('planet-distance').disabled;
        }, false);
    
        $planet.Application.createStarfieldBackground(document.body);
        var starfieldLayer = document.createElement('DIV');
        
        if (navigator.userAgent.toLowerCase().search('ipad') < 0) starfieldLayer.className = 'starfield-layer';
        
        document.body.appendChild(starfieldLayer);
        $planet.Application.createStarfieldBackground(starfieldLayer);

		$planet.context = new $planet.Types.PlanetContext({
			name: 'sqLite',
			databaseName: 'Planets',
			dbCreation: $data.storageProviders.sqLite.DbCreationType.Default
		});

		$planet.context.onReady(function(db){
			db.Planets.toArray(function(result){
				if (result.length) $planet.Application.build();
				else $planet.Types.PlanetContext.ourSolarSystem(db, function(){
					$planet.Application.build();
				});
			});
		});
    },
    removeAll: function(){
        var els = document.querySelectorAll('body > .rotator');
        for (var i = 0; i < els.length; i++){
            document.body.removeChild(els[i]);
        }
        els = document.querySelectorAll('#planets .pills li');
        for (var i = 0; i < els.length; i++){
            var li = els[i];
            li.parentNode.removeChild(li);
        }
    },
    build: function(){
        var buildPlanets = function(id, parent){
            $planet.context.Planets
            .where(function(item){ return item.ParentId == this.id; }, { id: id })
            .toArray(function(result){
                for (var i = 0; i < result.length; i++){
                    if (parent) result[i].Parent = parent;
                    if (result[i].Children || !result[i].Parent) new $planet.System(result[i]);
                    new $planet.Planet(result[i]);
                    if (result[i].Children) buildPlanets(result[i].Id, result[i]);
                }
            });
        };
        buildPlanets(0);

        $planet.context.Planets
        .orderBy(function(item){ return item.Name; })
        .toArray(function(result){
            for (var i = 0; i < result.length; i++){
                var li = document.createElement('LI');
                li.id = 'planet-detail-' + result[i].Id;
                
                var a = document.createElement('A');
                a.planet = result[i];
                a.onclick = $planet.Application.detailsPlanet;
                a.innerHTML = result[i].Name;
                
                var d = document.createElement('DIV');
                d.className = 'details';
                
                var edit = document.createElement('BUTTON');
                edit.className = 'btn success';
                edit.innerHTML = 'Edit';
                edit.planet = result[i];
                edit.addEventListener('click', $planet.Application.editPlanet.bind(result[i]), false);

                var del = document.createElement('BUTTON');
                del.className = 'btn danger';
                del.innerHTML = 'Delete';
                del.planet = result[i];
                del.addEventListener('click', $planet.Application.removePlanet, false);

                var p = document.createElement('P');
                p.innerHTML = result[i].Text;

                d.appendChild(p);
                d.appendChild(edit);
                d.appendChild(del);
                
                li.appendChild(a);
                li.appendChild(d);
                
                document.querySelector('#planets ul').appendChild(li);
            }

            new iScroll('planets');
        });
    },
    createStarfieldBackground: function(el){
        var c = document.createElement('CANVAS');
        c.width = 512;
        c.height = 512;
        var ctx = c.getContext('2d');
        ctx.clearRect(0, 0, c.width, c.height);
        for (var i = 0; i < 32; i++){
            var shade = Math.rand(0, 256);
            ctx.fillStyle = 'rgb(' + shade + ', ' + shade + ', ' + (shade * 0.8) + ')';
            ctx.fillRect(Math.rand(0, c.width), Math.rand(0, c.height), 3, 3);
        }
        var img = c.toDataURL();
        
        if (navigator.userAgent.toLowerCase().search('ipad') < 0) el.addClass('starfield');
        
        el.style.backgroundImage = 'url(' + img + ')';
    },
    togglePlanetsPanel: function(){
        var i = document.getElementById('insert')
        if (i) i.removeClass('fadein');
        var p = document.getElementById('planets');
        if (p){
            if (p.hasClass('fadein')){
                var lia = document.querySelector('#planets li.active');
                if (lia) lia.removeClass('active');

                var a = document.querySelector('.selector.active');
                if (a) a.removeClass('active');
            }
            
            if (!document.querySelector('#planets li') && !p.hasClass('fadein')){
                alert('Please add a new planet!');
                return;
            }
            
            p[p.hasClass('fadein') ? 'removeClass' : 'addClass']('fadein');
        }
    },
    detailsPlanet: function(){
        var p = this.planet;
        
        var a = document.querySelector('.selector.active');
        if (a) a.removeClass('active');
        
        a = document.getElementById('planet-' + p.Id);
        a.addClass('active');
        
        var li = document.querySelector('.pills > li.active');
        if (li) li.removeClass('active');
        
        this.parentNode.addClass('active');
    },
    editPlanet: function(){
        var p = document.getElementById('planets');
        if (p) p.removeClass('fadein');

        var i = document.getElementById('insert');
        if (!i.hasClass('fadein')){
            var edit = this;
            if (edit && edit instanceof $planet.Types.Planet){
                document.getElementById('planet-id').value = edit.Id;
                document.getElementById('planet-name').value = edit.Name;
                document.getElementById('planet-text').value = edit.Text;
                document.getElementById('planet-shadowblur').value = edit.ShadowBlur;
                document.getElementById('planet-shadowstyle').value = edit.ShadowStyle;
                document.getElementById('planet-bodystyle').value = edit.BodyStyle;
                document.getElementById('planet-radius').value = edit.Radius;
                document.getElementById('planet-x').value = edit.X;
                document.getElementById('planet-y').value = edit.Y;
                document.getElementById('planet-distance').value = edit.Distance;
                document.getElementById('planet-distance').disabled = !edit.Distance;
                document.getElementById('planet-speed').value = edit.Speed;
                document.getElementById('planet-parent').checked = edit.ParentId;
                document.getElementById('planet-parentid').value = edit.ParentId;
                document.getElementById('planet-parentid').disabled = !edit.ParentId;
            }else{
                document.getElementById('planet-id').value = 0;
                document.getElementById('planet-name').value = 'New planet';
                document.getElementById('planet-text').value = 'Description...';
                document.getElementById('planet-shadowblur').value = 32;
                document.getElementById('planet-shadowstyle').value = '#fff';
                document.getElementById('planet-bodystyle').value = '#fff';
                document.getElementById('planet-radius').value = 32;
                document.getElementById('planet-x').value = 0;
                document.getElementById('planet-y').value = 0;
                document.getElementById('planet-distance').value = 0;
                document.getElementById('planet-distance').disabled = true;
                document.getElementById('planet-speed').value = 0;
                document.getElementById('planet-parent').checked = false;
                document.getElementById('planet-parentid').value = 0;
                document.getElementById('planet-parentid').disabled = true;
            }
            
            var s = document.querySelector('#insert select');
            if (s){
                s.innerHTML = '';
                $planet.context.Planets
                .orderBy(function(item){ return item.Name; })
                .toArray(function(result){
                    for (var i = 0; i < result.length; i++){
                        var o = document.createElement('OPTION');
                        o.value = result[i].Id;
                        o.innerHTML = result[i].Name;
                        o.selected = o.value == (edit ? edit.ParentId : -1);
                        s.appendChild(o);
                    }
                });
            }
            
            i.addClass('fadein');
        }
    },
    savePlanet: function(){
        $planet.context.Planets
        .filter(function(item){ return item.Id == this.id; }, { id: document.getElementById('planet-id').value })
        .toArray(function(result){
            if (!result.length){
                var edit = new $planet.Types.Planet({
                    Name: document.getElementById('planet-name').value,
                    Text: document.getElementById('planet-text').value,
                    ShadowBlur: document.getElementById('planet-shadowblur').value,
                    ShadowStyle: document.getElementById('planet-shadowstyle').value,
                    BodyStyle: document.getElementById('planet-bodystyle').value,
                    Radius: document.getElementById('planet-radius').value,
                    X: document.getElementById('planet-x').value,
                    Y: document.getElementById('planet-y').value,
                    Distance: document.getElementById('planet-distance').value,
                    Speed: document.getElementById('planet-speed').value,
                    ParentId: document.getElementById('planet-parent').checked ? document.getElementById('planet-parentid').value : 0
                });

                $planet.context.Planets.add(edit);
                $planet.context.saveChanges(function(){
                    if (edit.ParentId){
                        $planet.context.Planets
                        .where(function(item){ return item.Id == this.id; }, { id: edit.ParentId })
                        .toArray(function(result){
                            if (!result.length) return;
                            var parent = result[0];

                            $planet.context.Planets.attach(parent);
                            
                            parent.Children = true;

                            $planet.context.saveChanges(function(){
                                $planet.Application.removeAll();
                                $planet.Application.build();
                            });
                        });
                    }else{
                        $planet.Application.removeAll();
                        $planet.Application.build();
                    }
                });
            }else{
                var edit = result[0];

                $planet.context.Planets.attach(edit);
                
                edit.Name = document.getElementById('planet-name').value;
                edit.Text = document.getElementById('planet-text').value;
                edit.ShadowBlur = document.getElementById('planet-shadowblur').value;
                edit.ShadowStyle = document.getElementById('planet-shadowstyle').value;
                edit.BodyStyle = document.getElementById('planet-bodystyle').value;
                edit.Radius = document.getElementById('planet-radius').value;
                edit.X = document.getElementById('planet-x').value;
                edit.Y = document.getElementById('planet-y').value;
                edit.Distance = document.getElementById('planet-distance').value;
                edit.Speed = document.getElementById('planet-speed').value;
                edit.ParentId = document.getElementById('planet-parent').checked ? document.getElementById('planet-parentid').value : 0;

                $planet.context.saveChanges(function(){
                    if (edit.ParentId){
                        $planet.context.Planets
                        .where(function(item){ return item.Id == this.id; }, { id: edit.ParentId })
                        .toArray(function(result){
                            if (!result.length) return;
                            var parent = result[0];

                            $planet.context.Planets.attach(parent);
                            
                            parent.Children = true;

                            $planet.context.saveChanges(function(){
                                $planet.Application.removeAll();
                                $planet.Application.build();
                            });
                        });
                    }else{
                        $planet.Application.removeAll();
                        $planet.Application.build();
                    }
                });
            }
        });

        var i = document.getElementById('insert');
        if (i) i.removeClass('fadein');

        var a = document.querySelector('.selector.active');
        if (a) a.removeClass('active');
    },
    cancelEditPlanet: function(){
        var i = document.getElementById('insert');
        if (i) i.removeClass('fadein');

        var a = document.querySelector('.selector.active');
        if (a) a.removeClass('active');

        $planet.context.Planets
        .filter(function(item){ return item.Id == this.id; }, { id: document.getElementById('planet-id').value })
        .toArray(function(result){
            if (result.length){
                var edit = result[0];
                document.getElementById('planet-id').value = edit.Id;
                document.getElementById('planet-name').value = edit.Name;
                document.getElementById('planet-text').value = edit.Text;
                document.getElementById('planet-shadowblur').value = edit.ShadowBlur;
                document.getElementById('planet-shadowstyle').value = edit.ShadowStyle;
                document.getElementById('planet-bodystyle').value = edit.BodyStyle;
                document.getElementById('planet-radius').value = edit.Radius;
                document.getElementById('planet-x').value = edit.X;
                document.getElementById('planet-y').value = edit.Y;
                document.getElementById('planet-distance').value = edit.Distance;
                document.getElementById('planet-distance').disabled = !edit.Distance;
                document.getElementById('planet-speed').value = edit.Speed;
                document.getElementById('planet-parent').checked = edit.ParentId;
                document.getElementById('planet-parentid').value = edit.ParentId;
                document.getElementById('planet-parentid').disabled = !edit.ParentId;
            }
        });
    },
    removePlanet: function(){
        var p = this.planet;
        if (confirm('Are you sure you want to remove the planet "' + p.Name + '" from the galaxy?')){
            $planet.context.Planets.remove(p);
            $planet.context.saveChanges(function(count){
                var selector = document.getElementById('planet-' + p.Id);

                var pn = selector.parentNode;
                pn.removeChild(selector);
                pn.parentNode.removeChild(pn);

                var d = document.getElementById('planet-detail-' + p.Id);
                pn = d.parentNode;
                pn.removeChild(d);
                if (!pn.children.length) $planet.Application.togglePlanetsPanel();
            });
        }
    }
});

$(document).ready(function(){
    $planet.Application.init();
});
