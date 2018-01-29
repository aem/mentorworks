# MentorWorks Scout Theme

## Installation

1. Install [Docker](https://docs.docker.com/docker-for-mac/install/). Once you open it for the first time it should automatically start up. Docker is super lightweight so you can just always leave it running
2. In a Terminal inside of the `mentorworks` directory, run `docker-compose up -d`
3. The first time you do this it'll take a bit because it has to download the MySQL and Wordpress files for the first time
4. This starts Docker in detached mode (`-d`), to kill the process run `docker-compose down`.
5. That's it!! Go to `localhost:3000` and things will be there.

### How It Works

Docker is running on port 8000. If you go to `localhost:8000` things will look exactly the same and you shouldn't notice anything different. However, if you'd like the niceties of browsersync's hot-reloading and all of that nonsense, use the `localhost:3000` URL. Technically it's actually browsersync running on `localhost:3000` and that proxy's to the Docker container exposed on port 8000. Just use 3000, make your life easy.

### NPM

* Install [npm](http://blog.npmjs.org/post/85484771375/how-to-install-npm).
* Install dependencies `npm install`

### Getting Timber Working

* Navigate to `http://localhost:3000/wp-admin/` and log in with your wordpress account
* In the `wp-admin` dashboard, install Timber via `Plugins > Add New`, and do a keyword search for Timber and Twig.
* Still in the admin dashboard, find `Appearance` -> `Themes` and activate the MentorWorks theme

### Using Gulp

In order to see the theme you have to run `gulp build` first, then `gulp watch` because the wordpress is looking for the compiled version of the theme.

`gulp build`: Runs the gulp task to create the build folder that holds the theme

`gulp watch`: Runs the gulp task that watches your files and automatically reloads your browser

### Tips

* Make sure that whenever you pull from the repository you run `gulp build`
* If links aren't working login to the `wp-admin` and under settings/permalinks check and uncheck post name option and save (it resets the redirect for wordpress)

### Directory Structure

```
mentorworks
│   README.md
│   gulpconfig.js  -- Defines all gulp paths & configurations used in
│                     gulpfile.js directory
│   package.json   -- Defines all the dependencies needed that are installed
│                     using `npm install`
│   docker-compose.yml   -- The Dockerfile to get the WP server up and running
│
└───gulpfile.js
│   │   index.js   -- Main JS file
│   │
│   ├───tasks      -- holds all the different gulp tasks
│   │   ├───browsersync.js
│   │   ├───images.js
│   │   ├───main.js
│   │   ├───scripts.js
│   │   ├───styles.js
│   │   ├───theme.js
│   │   ├───utils.js
│   │___├───watch.js
│
└───src
│   │   *.php          -- main HTML page
│   │───inc            -- other includes
│   │───images         -- all the images that aren't on wordpress
│   │───js             -- holds all JavaScript files
│   │───scss           -- directory with sass files and fonts
|   |   |───base       -- base styles
|   |   |───component  -- global components (footer, nav)
|   |   |───lib        -- library stylesheets
|   |   |───page       -- pagespecific style sheets
|   |───fonts          -- fonts and iconfont files
│   │
│   ├───templates   -- holds the twig files
|   |   |───pages         -- twig files for pages ex. Home, About etc..
```
