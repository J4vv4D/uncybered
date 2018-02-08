import chai from 'chai';
import {JSDOM} from 'jsdom';
import {uncyberElementIfNecessary} from '../../main/src/content'

describe('Function uncyberElementIfNecessary', () => {
    it('replaces a single occurrence', async () => {
        // given
        const {document} = (new JSDOM('<p id="elem">cyber</p>')).window;
        const elementToBeReplaced = document.getElementById('elem');

        // when
        uncyberElementIfNecessary(elementToBeReplaced, document);

        // then
        chai.expect(elementToBeReplaced.outerHTML).to.equal('<p id="elem">IT</p>');
    });

    it('does not do anything on empty elements', async () => {
        // given
        const {document} = (new JSDOM('<p id="elem"></p>')).window;
        const elementToBeReplaced = document.getElementById('elem');

        // when
        uncyberElementIfNecessary(elementToBeReplaced, document);

        // then
        chai.expect(elementToBeReplaced.outerHTML).to.equal('<p id="elem"></p>');
    });

    it('replaces multiple occurrences only once', async () => {
        // given
        const {document} = (new JSDOM('<p id="elem">cyber cyber cyber</p>')).window;
        const elementToBeReplaced = document.getElementById('elem');

        // when
        uncyberElementIfNecessary(elementToBeReplaced, document);

        // then
        chai.expect(elementToBeReplaced.outerHTML).to.equal('<p id="elem">IT IT IT</p>');
    });

    it('replace divers occurrences only once', async () => {
        // given
        const {document} = (new JSDOM('<p id="elem">gartner forrester</p>')).window;
        const elementToBeReplaced = document.getElementById('elem');

        // when
        uncyberElementIfNecessary(elementToBeReplaced, document);

        // then
        chai.expect(elementToBeReplaced.outerHTML).to.equal('<p id="elem">generic analyst firm generic analyst firm</p>');
    });

    it('does not replace element IDs', async () => {
        // given
        const {document} = (new JSDOM('<p id="cyber">cyber</p>')).window;
        const elementToBeReplaced = document.getElementById('cyber');

        // when
        uncyberElementIfNecessary(elementToBeReplaced, document);

        // then
        chai.expect(elementToBeReplaced.outerHTML).to.equal('<p id="cyber">IT</p>');
    });
});
