describe("Sign In Flow", () => {
  it("should sign in the user", () => {
    cy.visit("/");

    cy.contains("Sign in").click();
    cy.url().should("include", "/sign-in");

    cy.get('input[name="email"]').type("admin@gmail.com");
    cy.get('input[name="password"]').type("admin");

    cy.get('[data-cy="sign-in-btn"]').click();

    cy.url().should("include", "/protected");
  });
  it("should sign out the user", () => {
    cy.visit("/");

    cy.contains("Sign in").click();
    cy.url().should("include", "/sign-in");

    cy.get('input[name="email"]').type("admin@gmail.com");
    cy.get('input[name="password"]').type("admin");
    cy.get('[data-cy="sign-in-btn"]').click();

    cy.get("[data-cy='sign-out-btn']").click();

    cy.url().should("include", "/sign-in");
  });
  it("failed sign in", () => {
    cy.visit("/");

    cy.contains("Sign in").click();
    cy.url().should("include", "/sign-in");

    cy.get('input[name="email"]').type(" asasdfdfg@gmail.com ");
    cy.get('input[name="password"]').type("admin");
    cy.get('[data-cy="sign-in-btn"]').click();
  });
});
