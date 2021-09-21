Sample GraphQL Theme
========================

This theme is based off of the CMS Starter Growth Theme. It includes modules and templates that demonstrate how to utilize GraphQL as part of a website built with HubSpot CMS and Custom CRM Objects.

# Using the Sample Theme

This document will guide you through the process of creating an example website for a fictional recruiting agency in the HubSpot CMS.

The end product will be a site where a recruiting agency can post roles they are looking to fill for their clients, job seekers can apply to fill those roles, and recruiters can move the applicant through the recruitment process from beginning to end. Finally, the agency can create Deals in the CRM to ultimately bill their clients for filling positions.

Throughout this process, we’ll touch on a number of aspects of the HubSpot platform, such as: CRM Custom Objects, Workflows, Forms, Custom Modules, GraphQL Data Queries, Lists, Memberships, and more.

The source code for the theme and schemas are in this GitHub repository: https://github.com/HubSpot/sample-graphql-theme

Let’s get started!

## Step 1: Create CRM Custom Objects

The first thing you’ll need to do is install the HubSpot CLI tools. This will make development much easier by allowing you to use the IDE you feel most comfortable with. To install the CLI tools, follow the instructions here: https://developers.hubspot.com/docs/cms/developer-reference/local-development-cli#install 

Once you have the CLI tools installed, clone the repository into a folder on your local file system. Then, navigate to that directory and run `hs init` to configure your project.

Now you have the theme and related schemas on your machine, you can create the Custom CRM objects straight from the CLI by running the following from your command line, in the root directory of your project: `hs custom-object schema create ./schemas/job_application.json` and `hs custom-object schema create ./schemas/role.json`

One thing to note in the schema of the Role object is the unique value, “Role Identifier”, this field is used when creating multiple interconnected objects using Forms. When we have a form that creates a Job Application, and we want it to also correlate the job application to a Role, we can populate this value in the form being submitted, and it will automatically associate the created Job Application with the Role, if it exists.

You should see a response in the CLI indicating the custom objects were successfully created, along with a link to view the custom objects directly in HubSpot. If you want to see all the properties that were created, click the Actions dropdown, and select `Edit properties`.

Now that our custom objects have been created, the next step is to create the association between our custom objects, so that a given Role can be associated to Job Applications. In order to do this, we’ll have to use the custom objects API endpoints.

To create the association, we’ll need to hit the API directly, using this endpoint: POST
/crm/v3/schemas/{objectType}/associations (more details for the endpoint can be found here: https://developers.hubspot.com/docs/api/crm/crm-custom-objects)

For the body of the request, we’ll need the object type ID for both of the objects for which we’re creating an association. We can find the object type ID by running the following command from the CLI: `hs custom-object schema list`. The output of that command should list your custom objects and their object type ID.

For example, the body of your request might look like this:

{
  "fromObjectTypeId": "2-2617384",
  "toObjectTypeId": "2-2783326"
}

Once the association is created, we should be finished creating our custom object definitions.

If you'd like, you can use our sample data [here](./data/role_data.json) to populate available job listings. You can make a POST request to /crm/v3/schemas/{objectType}/batch/create (more details can be found here: https://developers.hubspot.com/docs/api/crm/crm-custom-objects) with the JSON in that file to create 15 job listings. You should then associate each job listing with the related company (Spotify, HubSpot, or Tesla) manually in order for the rest of the site to render the job listings as expected.

## Step 2: Create Job Application Submission Form and Workflow

Now that the custom objects are created, you can upload the theme to HubSpot by running the following CLI command: `hs upload src sample-graphql-theme`

In order to prepare for creating our pages to display roles and allow prospective applicants to apply to a given role, we’ll need to create a form that we can use on our pages. When an applicant submits this form, we want to create a contact record (if the user doesn’t already exist as a contact), and an associated Job Application object that contains their resume and cover letter.

To create the form, open up HubSpot and navigate to Marketing > Lead Capture > Form. Click Create a Free Form, and select Embedded form as the type. Stick to the default Blank template and click Start to begin creating our form. By default, an Email field is already added for us, in addition to that we’ll want to drag over the First name and Last name properties to the form, as well as the Phone number property.

If you scroll down the properties sections, you’ll notice that for our Role and Job Application objects, only the default required fields are available to drag to our form. In order to enable some of our non-required fields, for example, Cover letter, we need to navigate to the Settings page, and edit the Job application properties. Find Cover letter, and click Edit, and check the box titled “Use in forms, and bots”. Do the same for Role Identifier in the Role object.

Now go back to the form builder, and add the following fields for Job Application to our form: Salary Requirement, Resume, Cover Letter, Job title, and Title (under Role), and Role Identifier. For Job title, edit the field and turn off “Make this field required” and then turn on “Make this field hidden”. For this field, we’re going to automatically populate it when the applicant views a role, since it’s required to create a Job Application record, and we don’t want our applicants to have to manually fill in the field. Similarly, for Role Identifier and Title you’ll also want to make the field hidden, as it will be auto populated.

That’s it for the form! Go ahead and change the name to something easy to remember, and click Update.

One other thing that should be done before we create our pages that allow users to submit applications, is to set up a Workflow that will define the default state of applications that are submitted. Navigate to the Workflows section and click Create Workflow. For this workflow, select Start from scratch, and select “Job application-based”. The enrollment trigger for this workflow will be when “Object ID” is known -- essentially, when a job application is first created.

For the action, we want to set a property value for the object. The property we’ll set is “Application Status” and we’ll set it to “Applied”. Go ahead and save this workflow. Now, whenever a new Job Application is created in our portal, the status will be set as “Applied”. This is useful because we can set up membership lists that automatically allow users to register on our site and access their submitted job applications, as we’ll see later.

## Step 3: Create Role Listing and Detail Pages

Now that the boilerplate objects, forms, and workflow are created, we can move on to creating the functional parts of the site where users can view roles, and submit applications for those roles. There are a number of different ways one could accomplish this.

The queries that will be used for our pages can be found in the “data-queries” folder of our theme. These GraphQL queries can be modified to include only the properties required for the page or modules they’re used in.

Create a new page, and for this page select the “Role Listing - GraphQL” template. This template contains the "Roles GraphQL" module, which uses the data retrieved by the data query in the template to show a listing of all created role objects. Give the page a title and publish it.

Next, we’ll need the details page. For this page, use the “Role Details - GraphQL” template. This time, drag in the `Role Details GraphQL` module. Additionally, you'll need to set the Job Application Form in the settings of that module to the form we created in Step 2.

Once that’s set, give the page a title, and replace the generated slug with the same one used in the role listing page, but with `/role` appended. For example, if the slug for the GraphQL listing page was “role-listing-graphql’, the slug for this page should be ‘role-listing-graphql/role’

## Step 4: Create Applications Page

The final step of the process is to create a page where applicants can log in and see any pending applications they have submitted, as well as the status of those applications. In order to set this up, we’re going to utilize the Memberships feature. For more detailed information about this feature, you can go here: https://developers.hubspot.com/docs/cms/data/memberships

To do this, we’ll have to do to allow us to set up pages that require registration, so we need to create a Membership list. To do this, navigate to Contacts > Lists and click Create List. This list will be Contact-based, and Active. For the Filter type, select Job Application properties, select Object ID, and is known. What this means, is a Contact will automatically be added to this list when an associated Job Application has been created.

Now we can create the pages in our CMS. Similarly to our other pages, create a new page with the Application Listing GraphQL template. Drag in the Existing Application Listing module, and then go to the Settings for this page. Expand the Advanced options section, and select “Private - Registration required” in the “Control audience access for this page” section. This will require you to select a list to use for sending registration emails. Next, give this page a title and publish the page.

Next, create the Application Details page. Follow the same steps as above, except the template this time will be Application GraphQL and the module you’ll drag in this time is the Application Details module. Before publishing this page, ensure the Content slug is “application-details”, as that slug is hard-coded in the Existing Application Listing module.

## Step 5: Wrapping Up

The last thing we’re going to do to tie everything together is create a menu at the top of our site that links us to all the pages. All of the pages and templates we’ve created so far share a header. In order to add a menu to the header, go ahead and edit any one of the pages, and click on the header in the page. It will open up in the Global Content Editor. From here, edit the existing Primary Navigation module, and create a menu to be shown on our pages.

Add two menu items, one for the Role Listing page, and one for the Application Listing page. Then, publish the menu. Now, ensure the new menu is selected in the Global Content Editor, and Publish your changes.
To test our site, go ahead and add some roles and submit some Job Applications to those Roles. You’ll notice that since you’re logged into your HubSpot account to edit the website, you won’t need to register to view the Job Applications page. If you’d like to test the Membership list and registration, you’ll need to open the site in an Incognito window and submit a Job Application using an e-mail address that isn’t associated with your existing HubSpot account.

That does it! You now have a fully functional recruiting website where people can view open positions, apply for jobs, and track their application status. On the other side of the process, recruiters can post job openings, keep in touch with applicants through the lifecycle of their application process, and create deals for companies for which applicants are being recruited. Those deals can be associated with Roles that need to be filled, and used to track the lifecycle of the recruitment process for a given company.

## Resources
https://developers.hubspot.com/docs/cms/developer-reference/local-development-cli
https://developers.hubspot.com/docs/api/crm/crm-custom-objects
https://developers.hubspot.com/docs/cms/data/memberships
