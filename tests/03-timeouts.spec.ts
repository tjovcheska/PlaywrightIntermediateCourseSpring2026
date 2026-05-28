import { test } from "../fixtures/authenticatedPage";
import { EditorPage } from "../pages/EditorPage";
import { HomePage } from "../pages/HomePage";

test.describe('authenticated users can open the editor - fixture', () => {

    test('can navigate to the editor', async ({ authenticatedPage }) => {
        const editorPage = new EditorPage(authenticatedPage);
        const homePage = new HomePage(authenticatedPage);

        await homePage.clickNewAricleNavLink();
        await editorPage.assertOnPage();
    });

});