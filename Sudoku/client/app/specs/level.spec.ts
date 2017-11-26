import { expect } from 'chai';

import { Level } from '../class/level';
import { LEVEL } from '../class/mock-levels';

describe ('Test de la class Niveau', function() {
    let currentLevel: Level;
    beforeEach(() => {
        currentLevel = new Level(null, null);
    });

    it ('Verifie que le niveau est null', function() {
        expect(currentLevel.level).to.equal(null);
        expect(currentLevel.name).to.equal(null);
    });

    it ('Verifie que Niveau a un nom "normal"', function() {
        currentLevel.name = "normal";
        expect(currentLevel.name).to.equal('normal');
    });

     it ('Verifie que Niveau est 0', function() {
        currentLevel.level = 0;
        expect(currentLevel.level).to.equal(0);
    });

    it ('Verifie que le tableau de Niveaux contient un niveau normal par défaut', function() {
        expect(LEVEL[0].level).to.equal(0);
        expect(LEVEL[0].name).to.equal("Normal");
    });

    it ('Verifie que le tableau de Niveaux n est pas vide ', function() {
        LEVEL[0] = currentLevel;
        expect(LEVEL).to.not.be.empty;
    });

    it ('Verifie que la taille du tableau de Niveau est 1 ', function() {
        expect(LEVEL.length).to.be.equal(1);
    });

    it ('Modifie le nom du niveau dans le tableau et Verifie qu il est "normal" ', function() {
        LEVEL[0].name = 'normal';
        expect(LEVEL[0].name).to.be.equal('normal');
    });

    it ('Modifie le niveau du niveau dans le tableau et Verifie qu il est "1" ', function() {
        LEVEL[0].level = 1;
        expect(LEVEL[0].level).to.be.equal(1);
    });

    it ('Ajoute un autre niveau au tableau', function() {
        LEVEL.push(new Level(0, "normal"));
        expect(LEVEL.length).to.be.equal(2);
    });

    it ('Supprime un niveau su tableau', function() {
        LEVEL.pop();
        expect(LEVEL.length).to.be.equal(1);
    });
});
