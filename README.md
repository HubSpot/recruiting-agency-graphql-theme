Sample GraphQL Theme
========================
:warning: This functionality is in beta and requires your account to be ungated. You can request access by submitting [this form](https://www.hubspot.com/devday2021/private-betas). By participating in this beta you agree to HubSpot's [Developer Terms](https://legal.hubspot.com/developer-terms) & [Developer Beta Terms](https://legal.hubspot.com/developerbetaterms). Please note this functionality is currently under development and is subject to change based on testing and feedback. :warning:

This theme is based off of the [HubSpot CMS Boilerplate](https://github.com/HubSpot/cms-theme-boilerplate) theme. It includes modules and templates that demonstrate how to utilize GraphQL as part of a website built with HubSpot CMS and Custom CRM Objects.

# Using the Sample Theme

This document will guide you through the process of creating an example website for a fictional recruiting agency in the HubSpot CMS.

The end product will be a site where a recruiting agency can post roles they are looking to fill for their clients, job seekers can apply to fill those roles, and recruiters can move the applicant through the recruitment process from beginning to end. Finally, the agency can create Deals in the CRM to ultimately bill their clients for filling positions.

Throughout this process, we’ll touch on a number of aspects of the HubSpot platform, such as: CRM Custom Objects, Workflows, Forms, Custom Modules, GraphQL Data Queries, Lists, Memberships, and more.

Let’s get started!

## Step 1: Create CRM Custom Objects

The first thing you’ll need to do is install the HubSpot CLI tools. This will make development much easier by allowing you to use the IDE you feel most comfortable with, as well as assist in creating CRM custom objects and seeding data. To install the CLI tools, follow the instructions [here](https://developers.hubspot.com/docs/cms/developer-reference/local-development-cli#install).

Once you have the CLI tools installed, clone the repository into a folder on your local file system. Then, navigate to that directory and run `hs init` to configure your project.

Now you have the theme and related schemas on your machine, you can create the Custom CRM objects straight from the CLI by running the following from your command line, in the root directory of your project: `hs custom-object schema create ./schemas/job_application.json` and `hs custom-object schema create ./schemas/role.json`

One thing to note in the schema of the Role object is the unique value, “Role Identifier”, this field is used when creating multiple interconnected objects using Forms. When we have a form that creates a Job Application, and we want it to also correlate the job application to a Role, we can populate this value in the form being submitted, and it will automatically associate the created Job Application with the Role, if it exists.

You should see a response in the CLI indicating the custom objects were successfully created, along with a link to view the custom objects directly in HubSpot. If you want to see all the properties that were created, click the Actions dropdown, and select `Edit properties`.

Now that our custom objects have been created, the next step is to create the association between our custom objects, so that a given Role can be associated to Job Applications. In order to do this, we’ll have to use the custom objects API endpoints.

To create the association, we’ll need to hit the API directly, using this endpoint: POST
/crm/v3/schemas/{objectType}/associations (more details for the endpoint can be found [here](https://developers.hubspot.com/docs/api/crm/crm-custom-objects)).

For the body of the request, we’ll need the object type ID for both of the objects for which we’re creating an association. We can find the object type ID by running the following command from the CLI: `hs custom-object schema list`. The output of that command should list your custom objects and their object type ID.

For example, the body of your request might look like this:

```
{
  "fromObjectTypeId": "2-2617384",
  "toObjectTypeId": "2-2783326"
}
```

If you have `curl` on your machine, you can send the request like so: `curl -d '{ "fromObjectTypeId": "{jobApplicationObjectTypeId}", "toObjectTypeId": "{roleObjectTypeId" }' -H 'Content-Type: application/json' https://api.hubapi.com/crm/v3/schemas/{jobApplicationObjectTypeId}/associations\?hapikey\={hapiKey}`, replacing `{roleObjectTypeId}` and `{jobApplicationObjectTypeId}` with the appropriate ids when running `hs custom-object schema list`, and replacing `{hapiKey}` with a generated API key for your portal. If you're not sure where to get your API key, see this [documentation](https://knowledge.hubspot.com/integrations/how-do-i-get-my-hubspot-api-key).

Note: Starting November 30, 2022, HubSpot API keys will no longer be able to be used as an authentication method to access HubSpot APIs. Private Apps will be used instead of APIs, you can defer to this [document](https://developers.hubspot.com/docs/api/private-apps) for more details on private apps.

**NOTE: It's important you create the association FROM the Job Application TO the Role, and not the other way around, or your GraphQL schema may differ slightly from what is expected. For example, if you create the association FROM the Role TO the Job Application, the associations field in your schema would be `role_collection__role_to_job_application` instead of the expected `role_collection__job_application_to_role`.**

Once the association is created, we should be finished creating our custom object definitions.

If you'd like, you can use our sample data [here](./data/role_data.json) to populate available roles. Using the CLI, you can run the following command from the root directory of the project: `hs custom-object create role ./data/role_data.json`. You should then associate each role with the related company (Spotify, HubSpot, or Tesla) manually in order for the rest of the site to render the roles as expected. The company name should be in the `Role Identifier` field when viewing the role.

## Step 2: Create Job Application Submission Form and Workflow

Now that the custom objects are created, you can upload the theme to HubSpot by running the following CLI command: `hs upload src recruiting-agency-graphql-theme`

In order to prepare for creating our pages to display roles and allow prospective applicants to apply to a given role, we’ll need to create a form that we can use on our pages. When an applicant submits this form, we want to create a contact record (if the user doesn’t already exist as a contact), and an associated Job Application object that contains their resume and cover letter.

To create the form, open up HubSpot and navigate to Marketing > Lead Capture > Form. Click Create a Free Form and select Embedded form as the type. Use the default Blank template and click Start to begin creating our form. By default, an Email field is already added for us, in addition to that we’ll want to drag over the First name and Last name properties to the form, as well as the Phone number property.

Now, add the following fields for Job Application to our form: Salary Requirement, Resume, Cover Letter, Job title. Then add Title (under Role) and Role Identifier. For Job title, edit the field and turn off “Make this field required” and then turn on “Make this field hidden”. For this field, we’re going to automatically populate it when the applicant views a role, since it’s required to create a Job Application record, and we don’t want our applicants to have to manually fill in the field. Similarly, for Role Identifier and Title you’ll also want to make the field hidden, as it will be auto populated.

That’s it for the form! Go ahead and change the name to something easy to remember, and click Update.

One other thing that should be done before we create our pages that allow users to submit applications, is to set up a Workflow that will define the default state of applications that are submitted. Navigate to the Workflows section and click Create Workflow. For this workflow, select Start from scratch, and select “Job application-based”. The enrollment trigger for this workflow will be when “Record ID” is known -- essentially, when a job application is first created.

For the action, we want to set a property value for the object. The property we’ll set is “Application Status” and we’ll set it to “Applied”. Go ahead and publish this workflow. Now, whenever a new Job Application is created in our portal, the status will be set as “Applied”. This is useful because we can set up membership lists that automatically allow users to register on our site and access their submitted job applications, as we’ll see later.

## Step 3: Create Role Listing and Detail Pages

Now that the objects, forms, and workflow are created, we can move on to creating the functional parts of the site where users can view roles, and submit applications for those roles. There are a number of different ways one could accomplish this.

The queries that will be used for our pages can be found in the “data-queries” folder of our theme. These GraphQL queries can be modified to include only the properties required for the page or modules they’re used in.

Create a new page, and for this page select the "Role listing" template. This template contains the "Role listing" module, which uses the data retrieved by the data query in the template to show a listing of all created role objects. Give the page a title and make note of the content slug for this page, as we'll use it when setting up the detail page and publish it. To ease setting up the rest of the site, it's recommended you set the content slug to `roles` for this page.

Next, we’ll need the details page. For this page, use the "Role details" template. This template contains both the "Role details" module and above that, the "Featured roles" module, which shows other roles in the same company and department the applicant may be interested in. Select the "Role details" module and set the Job Application Form in the settings of that module to the form we created in Step 2.

For the detail page, we'll be setting it up as a data query dynamic page. This means we'll be attaching a data query to the page itself (instead of to the module or template), and that query will be one that grabs a single instance of an object, in this case a Role. Go ahead and go to the page settings and expand the Advanced Options section. In the Dynamic Pages section, select the "Role Instance" query in the Data source dropdown. Next, we need to set the slug for the page to be dynamic. A dynamic slug is one that uses the syntax `[:dynamic-slug]` in the Page URL. The parts that make up the dynamic slug are accessed in the data query using the HubL `{{ request.path_param_dict.dynamic_slug }}`. 

Now, go ahead and manually update the Page URL to match the one in the role listing page, but with `/[:dynamic-slug]` appended. For example, if the slug for the role listing page was `roles`, the slug for this page should be `roles/[:dynamic-slug]`. Applicants will then be able to access an individual role using it's role identifier in place of the dynamic slug token, for example: `roles/spotify-engineer-i`.

Finally, give the page a title and publish it.

## Step 4: Create Applications Page

The final step of the process is to create a page where applicants can log in and see any pending applications they have submitted, as well as the status of those applications. In order to set this up, we’re going to utilize the Memberships feature. For more detailed information about this feature, you can go [here](https://developers.hubspot.com/docs/cms/data/memberships).

To do this, we’ll have to set up pages that require registration, so we need to create a Membership list. To do this, navigate to Contacts > Lists and click Create List. This list will be Contact-based, and Active. Give it a name and hit Next. For the Filter type, select Job Application properties, select Record ID, and is known. What this means, is a Contact will automatically be added to this list when an associated Job Application has been created. Go ahead and click Save List.

Now we can create the pages in our CMS. Similarly to our other pages, create a new page with the "Application listing" template. Go to the Settings for this page, expand the Advanced options section, and select “Private - Registration required” in the “Control audience access for this page” section. This will require you to select a list to use for sending registration emails. Next, give this page a title and publish the page.

Next, create the Application Details page. Follow the same steps as above, except the template this time will be "Application details". Before publishing this page, ensure the Content slug is `application-details`, as that slug is hard-coded in the Application Listing module.

## Step 5: Wrapping Up

The last thing we’re going to do to tie everything together is create a menu at the top of our site that links us to all the pages. All of the pages and templates we’ve created so far share a header. In order to add a menu to the header, go ahead and edit any one of the pages, and click on the header in the page. It will open up in the Global Content Editor. From here, edit the existing Primary Navigation module, and create a menu to be shown on our pages.

Add two menu items, one for the Role Listing page, and one for the Application Listing page. Then, publish the menu. Now, ensure the new menu is selected in the Global Content Editor, and Publish your changes.

To test our site, go ahead and submit some Job Applications to a few different roles. You’ll notice that since you’re logged into your HubSpot account to edit the website, you won’t need to register to view the Job Applications page. If you’d like to test the Membership list and registration, you’ll need to open the site in an Incognito window and submit a Job Application using an e-mail address that isn’t associated with your existing HubSpot account. **Note: In order for registration e-mails to be sent, a valid domain must be connected to your HubSpot portal. See prerequisites here: https://knowledge.hubspot.com/website-pages/require-member-registration-to-access-private-content**

That does it! You now have a fully functional recruiting website where people can view open positions, apply for jobs, and track their application status. On the other side of the process, recruiters can post job openings, keep in touch with applicants through the lifecycle of their application process, and create deals for companies for which applicants are being recruited. Those deals can be associated with Roles that need to be filled, and used to track the lifecycle of the recruitment process for a given company.

## Extra Credit: HubDB

If you have access to HubDB, there are also modules and data included to demonstrate the usage of GraphQL to pull data from HubDB. To get started, use the HubSpot CLI to create the sample HubDB table in your portal by using the following command: `hs hubdb create ./hubdb/recruiting_events.json`. You should see a message indicating the table was created with 3 rows.

Now, we'll need to upload the HubDB related assets to our theme. These are stored in the `extra-credit` folder. You can use the following CLI command: `hs upload extra-credit recruiting-agency-graphql-theme` to upload the assets into the same theme we have been using for the previous steps.

Now that the table is created, and the required assets are uploaded to our portal, we'll need to add the Recruiting Events module to our Role Listings page. Go ahead and edit the Role Listings page we created earlier, and drag and drop the Recruiting Events module below the Role Listing module. By default, this module will list all rows of the HubDB table we created, but a module field has been added to allow you to set the minimum date and time to start listing events. For example, if we set the module field to `03/01/2022` it will list all events with a start date on or after that date.

That should do it! One final thing to mention: While this sample doesn't explicitly demonstrate this functionality, it is possible to retrieve both HubDB data and CRM data in the same query. So, if you have data in both Custom Objects and HubDB tables and you want to use both sets of data in a single page, template, or module, GraphQL makes it easier than ever!

## Resources
https://developers.hubspot.com/docs/cms/data/query-hubspot-data-using-graphql  

https://developers.hubspot.com/docs/cms/developer-reference/local-development-cli

https://developers.hubspot.com/docs/api/crm/crm-custom-objects

https://developers.hubspot.com/docs/cms/data/memberships
