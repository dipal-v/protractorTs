@organisation
Feature: Organisations
    As a user of Leto
    I want to browse around
    So that I can manage legal entities

    Scenario: View a record
        Given I am on organisations home page
        When I click "NIPP003" on the table
        Then I see "Testy Explore" in the title

    @list
    Scenario: List View
        Given I am on organisations home page
        Then I see "Testy Explore" from the back end in organisations page

    @search @list
    Scenario Outline: List View Search Entity
        Given I am on organisations home page
        Then I see "Testy Explore" from the back end in organisations page
        When I search for "<query>" with "<filter>" filter
        Then I verify <resultsCount> results in search results
        Examples:
        | query | filter        | resultsCount |
        | 176   | entity code   | 4            |
        | A     | credit region | 6            |
        | Exp   | primary name  | 5            |

    @search @list @regex
    Scenario Outline: List View Search Entity wth regular expersion
        Given I am on organisations home page
        Then I see "Testy Explore" from the back end in organisations page
        When I search for regex "<query>" with "<filter>" filter
        Then I verify <resultsCount> results in search results
        Examples:
        | query  | filter        | resultsCount |
        | ^1.*   | entity code   | 4            |
        | Test.* | primary name  | 2            |

    @validation
    Scenario: Create organization record validation
        Given I am on organisations home page
        When I click create organization page
        When I click the create button
        Then I see the 7 validation errors displayed

    @typeahead
    Scenario Outline: Check typeahead works correctly
        Given I am on organisations home page
        When I click create organization page
        When I search for parent entity "<query>"
        Then I verify <resultsCount> results in the populated list
        Examples:
        | query | resultsCount |
        | or    | 6            |
        | ore   | 2            |

    Scenario: Create organization record
        Given I am on organisations home page
        When I click create organization page
        When I fill the organization form with name "Test Organization" and entity code "123456"
        When I click the create button
        Then I see "Test Organization" in the title

    Scenario: Cancel create orgarnization
        Given I am on organisations home page
        When I click create organization page
        When I click the cancel button
        Then I see "Testy Explore" from the back end in organisations page

    Scenario: click back button in view entity page
        Given I have an existing entity with legal entity code "NIPP003"
        Then I see "Testy Explore" in the title
        When I click the back button
        Then I see "Testy Explore" from the back end in organisations page

    Scenario: Deactivate organization record cancel action
        Given I have an existing entity with legal entity code "176215"
        Then I see "Cheddar Exploration without address" in the title
        When I click the deactivate button
        When I click the no button in confirm dialog
        Then I should not see an end date

    Scenario: Deactivate organization record
        Given I have an existing entity with legal entity code "176215"
        Then I see "Cheddar Exploration without address" in the title
        When I click the deactivate button
        When I click the yes button in confirm dialog
        Then I should see an end date

    Scenario: Activate organization record cancel action
        Given I have an existing entity with legal entity code "176215"
        Then I see "Cheddar Exploration without address" in the title
        When I click the activate button
        When I click the no button in confirm dialog
        Then I should see an end date

    Scenario: Activate organization record
        Given I have an existing entity with legal entity code "176215"
        Then I see "Cheddar Exploration without address" in the title
        When I click the activate button
        When I click the yes button in confirm dialog
        Then I should not see an end date

    Scenario: Create Child Organization
        Given I have an existing entity with legal entity code "176215"
        Then I see "Cheddar Exploration without address" in the title
        When I click the create child button
        When I fill create child organization form with name "Test Child Organization" and entity code "234567"
        When I click the create button
        Then I see "Test Child Organization" in the title
        Then I should see parent name as "Cheddar Exploration without address"

    Scenario: Modify organization record
        Given I am on organisations home page
        Given I have an existing entity with legal entity code "176215"
        Then I see "Cheddar Exploration without address" in the title
        When I click modify button
        When I update the organization form with name "Cheddar Exploration without address 1"
        When I click the update button
        Then I see "Cheddar Exploration without address 1" in the title

    Scenario: Cancel Modify organization record
        Given I am on organisations home page
        Given I have an existing entity with legal entity code "NIPP003"
        Then I see "Testy Explore" in the title
        When I click modify button
        When I click the cancel button
        Then I see "Testy Explore" from the back end in organisations page
