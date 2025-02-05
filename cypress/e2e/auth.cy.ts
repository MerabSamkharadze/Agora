describe("Sign Up Flow", () => {
  it("should sign up and sign in the user", () => {
    cy.visit("http://localhost:3000");

    cy.contains("Sign up").click();
    cy.url().should("include", "/sign-up");

    cy.get('input[name="email"]').type("testuser51@example.com");
    cy.get('input[name="password"]').type("password123");

    cy.get("button[type='submit']").click();

    cy.contains("Thanks for signing up!", { timeout: 5000 }).should(
      "be.visible"
    );
  });
});
