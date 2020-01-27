# Doxygen => Markdown

[![NPM version](https://img.shields.io/node/v/doxygen2markdown)](https://npmjs.org/package/doxygen2markdown)
[![Patreon](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fshieldsio-patreon.herokuapp.com%2Fprofiler4100&style=flat&cacheSeconds=3600)](https://www.patreon.com/profiler4100)

NodeJS CLI application that converts Doxygen XML documentation into Markdown files for Bitbucket Wiki, GitHub Pages and other places.

## Installation

Install this app by running next code using terminal (Unix/Linux/MacOS) or command prompt (Windows) 

```
npm i -g doxygen2markdown 
```

## Usage

1. Add `GENERATE_XML=YES` to your `Doxyfile` first.
2. Run `doxygen` to generate the XML documentation.
3. Install `doxygen2markdown` like so: `npm install doxygen2markdown -g` if you don't do this earlier.
4. Run `doxygen2markdown` providing the folder location of the XML documentation as it is said in documentation.  

**P.S.** You can see options by running next command `doxygen2markdown` without any options.

```
doxygen2markdown
Options:
  -V, --version           output the version number
  -d, --doxygen <type>    Doxygen XML output directory
  -o, --output <type>     Converter output directory.
  -t, --templates <type>  Custom templates directory
  -h, --help              output usage information
```

## Patrons <span id="patrons"></span>

Auto update WIP

## Become a Patron

Support this project by becoming a Patron on Patreon. [Sponsor this developer ❤️](https://www.patreon.com/profiler4100)

##License

Read LICENSE file for detailed information.