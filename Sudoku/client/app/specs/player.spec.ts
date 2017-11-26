import { expect } from 'chai';

import { Player } from '../class/player';
import { PLAYERS } from '../class/mock-players';

describe('Test de la class Joueur', function () {
    let player: Player;
    beforeEach(() => {
        player = new Player(null);
    });

    it('Verifie que le joueur est null', function () {
        expect(player.username).to.equal(null);
    });

    it('Verifie que Joueur a un pseudo "Angular"', function () {
        player.username = "Angular";
        expect(player.username).to.equal('Angular');
    });

    it('Verifie que le tableau de Joueur est vide', function () {
        expect(PLAYERS).to.be.empty;
    });

    it('Verifie que le tableau de Joueur n est pas vide ', function () {
        PLAYERS.push(player);
        expect(PLAYERS).to.not.be.empty;
    });

    it('Verifie que la taille du tableau de Joueur est 1 ', function () {
        expect(PLAYERS.length).to.be.equal(1);
    });

    it('Modifie le pseudo du joeur dans le tableau et Verifie qu il est "Mocha" ', function () {
        PLAYERS[0].username = 'Mocha';
        expect(PLAYERS[0].username).to.be.equal('Mocha');
    });

    it('Ajoute un autre joueur au tableau', function () {
        PLAYERS.push(new Player('Patate'));
        expect(PLAYERS.length).to.be.equal(2);
    });

    it('Supprime un jouer su tableau', function () {
        PLAYERS.pop();
        expect(PLAYERS.length).to.be.equal(1);
    });
});
