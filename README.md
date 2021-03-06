# Doxygen => Markdown

[![NPM version](https://img.shields.io/npm/v/doxygen2markdown)](https://npmjs.org/package/doxygen2markdown)
[![Patreon](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fshieldsio-patreon.herokuapp.com%2Fprofiler4100&style=flat)](https://www.patreon.com/profiler4100)

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

**P.S.S.** For template syntax read the [documentation for EJS](https://github.com/mde/ejs) 

```
doxygen2markdown
Options:
  -V, --version           Output the version number
  -d, --doxygen <type>    Doxygen XML output directory
  -o, --output <type>     Converter output directory.
  -t, --templates <type>  Custom templates directory. (optional)
  -v, --verbose           Outputs every filename that was converted. (optional) (default: false)
  -q, --quiet             Completely disables output. (optional) (default: false)
  -h, --help              Output usage information
```


## Examples

To convert documentation you can use next command:

`doxygen2markdown -d "<path to doxygen xml folder>" -o "<path to markdown folder>"`

If you want to convert documentation with your own templates, use next command:  

`doxygen2markdown -d "<path to doxygen xml folder>" -o "<path to markdown folder>" -t "<path to templates folder>"`

**P.S.** You can copy templates folder from this repository to get a fast start.

**P.S.S.** For template syntax read the [documentation for EJS](https://github.com/mde/ejs) 


## ToDo list

1. Add group, namespace conversion support.
2. Add code conversion to to class/interface.
3. Add Doxygen AUTOLINK_SUPPORT flag support.


## Patrons <span id="patrons"></span>

Auto update WIP


## Become a Patron

Support this project by becoming a Patron on Patreon. [Sponsor this developer ❤](https://www.patreon.com/profiler4100)


## License

Read LICENSE file for detailed information.