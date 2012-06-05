$data.Class.define('$planet.Types.Planet', $data.Entity, null, {
	Id: { dataType: 'int', key: true, computed: true },
	Name: { dataType: 'string' },
	Text: { dataType: 'string' },
	ShadowBlur: { dataType: 'int' },
	ShadowStyle: { dataType: 'string' },
	BodyStyle: { dataType: 'string' },
	Radius: { dataType: 'int' },
	X: { dataType: 'int' },
	Y: { dataType: 'int' },
	Distance: { dataType: 'int' },
	Speed: { dataType: 'number' },
	Children: { dataType: 'bool' },
	ParentId: { dataType: 'int' }
}, null);

$data.Class.define('$planet.Types.PlanetContext', $data.EntityContext, null, {
	Planets: { dataType: $data.EntitySet, elementType: $planet.Types.Planet }
}, null);

$planet.Types.PlanetContext.ourSolarSystem = function(c, cb){
    var sun = new $planet.Types.Planet({
        Id: 1,
        Name: 'Sun',
        Text: 'The Sun is a star, a hot ball of glowing gases at the heart of our solar system. Its influence extends far beyond the orbits of distant Neptune and Pluto. Without the Sun\'s intense energy and heat, there would be no life on Earth. And though it is special to us, there are billions of stars like our Sun scattered across the Milky Way galaxy.',
        ShadowBlur: 128,
        ShadowStyle: '#fa0',
        BodyStyle: '#fb0',
        Radius: 70,
        X: 1000,
        Y: 700,
        Children: true,
        ParentId: 0
    });

    var mercury = new $planet.Types.Planet({
        Id: 2,
        Name: 'Mercury',
        Text: 'Sun-scorched Mercury is only slightly larger than Earth\'s Moon. Like the Moon, Mercury has very little atmosphere to stop impacts and it is covered with craters. Mercury\'s dayside is super heated by the Sun, but at night temperatures drop hundreds of degrees below freezing. Ice may even exist in craters. Mercury\'s egg-shaped orbit takes it around the Sun every 88 days.',
        ShadowBlur: 32,
        ShadowStyle: '#aaa',
        BodyStyle: '#aaa',
        Radius: 16,
        Distance: 175,
        Speed: 8.8,
        ParentId: 1
    });

    var venus = new $planet.Types.Planet({
        Id: 3,
        Name: 'Venus',
        Text: 'Venus is a dim world of intense heat and volcanic activity. Similar in structure and size to Earth, Venus\' thick, toxic atmosphere traps heat in a runaway \'greenhouse effect.\' The scorched world has temperatures hot enough to melt lead. Glimpses below the clouds reveal volcanoes and deformed mountains. Venus spins slowly in the opposite direction of most planets.',
        ShadowBlur: 32,
        ShadowStyle: '#bf8639',
        BodyStyle: '#bf8639',
        Radius: 24,
        Distance: 250,
        Speed: 22.5,
        ParentId: 1
    });

    var earth = new $planet.Types.Planet({
        Id: 4,
        Name: 'Earth',
        Text: 'Earth is an ocean planet. Our home world\'s abundance of water - and life - makes it unique in our solar system. Other planets, plus a few moons, have ice, atmospheres, seasons and even weather, but only on Earth does the whole complicated mix come together in a way that encourages life - and lots of it.',
        ShadowBlur: 16,
        ShadowStyle: '#fff',
        BodyStyle: '#11f',
        Radius: 30,
        Distance: 350,
        Speed: 36.5,
        Children: true,
        ParentId: 1
    });

    var mars = new $planet.Types.Planet({
        Id: 5,
        Name: 'Mars',
        Text: 'Though details of Mars\' surface are difficult to see from Earth, telescope observations show seasonally changing features and white patches at the poles. For decades, people speculated that bright and dark areas on Mars were patches of vegetation, that Mars could be a likely place for life-forms, and that water might exist in the polar caps. When the Mariner 4 spacecraft flew by Mars in 1965, many were shocked to see photographs of a bleak, cratered surface. Mars seemed to be a dead planet. Later missions, however, have shown that Mars is a complex member of the solar system and holds many mysteries yet to be solved.',
        ShadowBlur: 32,
        ShadowStyle: '#f60',
        BodyStyle: '#a30',
        Radius: 36,
        Distance: 450,
        Speed: 68.6,
        ParentId: 1
    });

    var jupiter = new $planet.Types.Planet({
        Id: 6,
        Name: 'Jupiter',
        Text: 'The most massive planet in our solar system, with four large moons and many smaller moons, Jupiter forms a kind of miniature solar system. Jupiter resembles a star in composition. In fact, if it had been about 80 times more massive, it would have become a star rather than a planet.',
        ShadowBlur: 32,
        ShadowStyle: '#fc6',
        BodyStyle: '#fc6',
        Radius: 64,
        Distance: 600,
        Speed: 433.2,
        ParentId: 1
    });

    var saturn = new $planet.Types.Planet({
        Id: 7,
        Name: 'Saturn',
        Text: 'Saturn was the most distant of the five planets known to the ancients. Like Jupiter, Saturn is made mostly of hydrogen and helium. Its volume is 755 times greater than that of Earth. Winds in the upper atmosphere reach 500 meters (1,600 feet) per second in the equatorial region. These super-fast winds, combined with heat rising from within the planet\'s interior, cause the yellow and gold bands visible in the atmosphere.',
        ShadowBlur: 128,
        ShadowStyle: '#ff3',
        BodyStyle: '#fc9',
        Radius: 56,
        Distance: 800,
        Speed: 1076,
        ParentId: 1
    });

    var uranus = new $planet.Types.Planet({
        Id: 8,
        Name: 'Uranus',
        Text: 'The first planet found with the aid of a telescope, Uranus was discovered in 1781 by astronomer William Herschel. The seventh planet from the Sun is so distant that it takes 84 years to complete one orbit.',
        ShadowBlur: 64,
        ShadowStyle: '#aaf',
        BodyStyle: '#aaf',
        Radius: 48,
        Distance: 1000,
        Speed: 3080,
        ParentId: 1
    });

    var neptune = new $planet.Types.Planet({
        Id: 9,
        Name: 'Neptune',
        Text: 'Nearly 4.5 billion kilometers (2.8 billion miles) from the Sun, Neptune orbits the Sun once every 165 years. It is invisible to the naked eye because of its extreme distance from Earth. Interestingly, the unusual elliptical orbit of the dwarf planet Pluto brings Pluto inside Neptune\'s orbit for a 20-year period out of every 248 Earth years',
        ShadowBlur: 64,
        ShadowStyle: '#66f',
        BodyStyle: '#66f',
        Radius: 48,
        Distance: 1200,
        Speed: 6019,
        ParentId: 1
    });

    var pluto = new $planet.Types.Planet({
        Id: 10,
        Name: 'Pluto',
        Text: 'Tiny, cold and incredibly distant, Pluto was discovered in 1930 and long considered to be the ninth planet. But after the discoveries of similar intriguing worlds even farther out, Pluto was reclassified as a dwarf planet. This new class of worlds may offer some of the best evidence of the origins of our solar system.',
        ShadowBlur: 16,
        ShadowStyle: '#883',
        BodyStyle: '#883',
        Radius: 16,
        Distance: 1400,
        Speed: 9061,
        ParentId: 1
    });

    var moon = new $planet.Types.Planet({
        Id: 11,
        Name: 'Moon',
        Text: 'The Moon is the only natural satellite of the Earth, and the fifth largest satellite in the Solar System. It is the largest natural satellite of a planet in the Solar System relative to the size of its primary, having a quarter the diameter of Earth and 1⁄81 its mass. The Moon is the second densest satellite after Io, a satellite of Jupiter. It is in synchronous rotation with Earth, always showing the same face; the near side is marked with dark volcanic maria among the bright ancient crustal highlands and prominent impact craters. It is the brightest object in the sky after the Sun, although its surface is actually very dark, with a similar reflectance to coal. Its prominence in the sky and its regular cycle of phases have, since ancient times, made the Moon an important cultural influence on language, calendars, art and mythology. The Moon\'s gravitational influence produces the ocean tides and the minute lengthening of the day. The Moon\'s current orbital distance, about thirty times the diameter of the Earth, causes it to appear almost the same size in the sky as the Sun, allowing it to cover the Sun nearly precisely in total solar eclipses.',
        ShadowBlur: 8,
        ShadowStyle: '#999',
        BodyStyle: '#aaa',
        Radius: 8,
        Distance: 70,
        Speed: 2.7,
        ParentId: 4
    });
    
    c.Planets.add(sun);
    c.Planets.add(mercury);
    c.Planets.add(venus);
    c.Planets.add(earth);
    c.Planets.add(mars);
    c.Planets.add(jupiter);
    c.Planets.add(saturn);
    c.Planets.add(uranus);
    c.Planets.add(neptune);
    c.Planets.add(pluto);
    c.Planets.add(moon);
    
    c.saveChanges(function(count){
        if (cb) cb(count);
    });
};
