@site
Feature: Site Dialog
As a user of Leto
I want to create an site for a legal entity
So I can view the site details

    @validation
    Scenario: Site validations
        Given I am on organisations home page
        Given I have an existing entity with legal entity code "176213"
        Then I see "Oil Exploration Without Contact and Address" in the title
        When I click New Site button
        Then I should see "New Site" dialog
        When I click the site dialog button
        Then I see the 4 validation errors displayed

    Scenario: Create an site in organisation page
        Given I am on organisations home page
        Given I have an existing entity with legal entity code "176213"
        Then I see "Oil Exploration Without Contact and Address" in the title
        When I click New Site button
        Then I should see "New Site" dialog
        When I fill the aircraft site details with name "Beijing Aviation"
        Then I see site name "Beijing Aviation" on the entity page

    Scenario: Update an site in organisation page
        Given I am on organisations home page
        Given I have an existing entity with legal entity code "176212"
        Then I see "Test Explore USA" in the title
        When I click edit button in the grid for site
        Then I should see "Update Site" dialog
        When I fill the aircraft site details with name "Beijing Aviation"
        Then I see site name "Beijing Aviation" on the entity page

    Scenario: Create an site in person page
        Given I am on organisations home page
        Given I have an existing person entity with legal entity code "176223"
        Then I see "Mr. John Doe" in the title
        When I click New Site button
        Then I should see "New Site" dialog
        When I fill the vessel site details with name "Beijing Maritime"
        Then I see site name "Beijing Maritime" on the entity page
