import { test } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { HomePage } from '../pages/HomePage';
import { generateUser } from '../utils/testData';

import {
    epic, feature, story, severity, label, description, Severity,
  } from 'allure-js-commons';

test.describe('Sign up', { tag: ['@signup', '@pom'] },() => {
    test.only('registers a new user and redirects to the home feed', async ({ page }) => {
      await epic('Authentication')
      await feature('Sign up feature')
      await story('Register a new user')
      await severity(Severity.CRITICAL);
      await label('layer', 'ui');
      await description('Desc - Register a new user')

      const user = generateUser();
  
      const registerPage = new RegisterPage(page);
      const homePage = new HomePage(page);
  
      await registerPage.goto();
      await registerPage.register(user.username, user.email, user.password);
  
      await homePage.assertOnHomePage();
      await homePage.assertNavUsername(user.username);
      await homePage.assertSignedUp();
  
    });
  });
  