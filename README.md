# GameIO

Make online web-based games and applications quick and easily

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You will need a web browser and NodeJS to get started
To download node, visit http://nodejs.org/

### Installing

A step by step series of examples that tell you have to get a development env running on Windows

Note that this will only with with gameio 0.0.4

Download this repository on your machine and extract it

Open command prompt and cd to the directory you extracted to + \server, so you would type something like this in your console:

```
cd C:\Users\MrUser\Desktop\gameio\server
```

Then type "npm install gameio@0.0.4" and press enter to download the latest version of the GameIO server which is also open-source on NPM

After that, you can finally type "node example1.js" or "node example2.js" to run one of the examples
Then navigate to the client folder and open the corresponding example

This is meant to all run locally, to run on a VPS or other computer, follow the same steps of installing node, but for the client,
look for the "game.createSocket" line in the example HTML and change the IP passed in there from localhost to the IP
Be mindful that if running on Cloud 9 or another VPS that defines process.env.IP or process.env.PORT that it will use that
first, but if not defined it will be 5000, for Cloud 9 that port would be 8080

## Dependencies

* GameIO uses the uws and p2 node modules which will automatically be installed when running "npm install gameio" as mentioned up above

## Authors

* **Mathew Matakovic** - *Initial work* - [GoalieSave25](https://github.com/goaliesave25)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Thanks to the authors of uws and p2 for making these great modules that I used
