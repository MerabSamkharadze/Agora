/// <reference types="cypress" />
import "cypress-file-upload";

describe("Startup Form", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.contains("Sign in").click();
    cy.url().should("include", "/sign-in");

    cy.get('input[name="email"]').type("admin2@gmail.com");
    cy.get('input[name="password"]').type("admin2");

    cy.get('[data-cy="sign-in-btn"]').click();
    cy.url().should("include", "/protected");
    cy.visit("/protected/products/create");
  });

  it("submits a new product", () => {
    cy.get('[data-cy="title"]').type("Test Startup");

    cy.get('[ data-cy="description"]').type(
      "This is a test startup description."
    );

    cy.get('[data-cy="price"]').clear().type("10");

    cy.get('[ data-cy="category"]').type("Test Category");

    const fileName = "test-image.png";

    cy.fixture(fileName, "base64").then((fileContent) => {
      cy.get('[ data-cy="image"]').attachFile({
        fileContent,
        fileName,
        mimeType: "image/png",
        encoding: "base64",
      });
    });

    cy.get('[data-cy="addProduct-btn"]').click();

    cy.get('[data-cy="addProduct-btn"]').contains(/Submitting\.\.\./);

    cy.url({ timeout: 10000 }).should("include", "/protected");
  });
});
