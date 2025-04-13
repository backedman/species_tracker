# Species Tracker
Submission for [Bitcamp 2025](https://bitcamp2025.devpost.com/?_gl=1*ispaut*_gcl_au*MTU4MDQ2MzUwNS4xNzQ0NDEzNzc3*_ga*MTE2NDcwNDY0OS4xNjc3MDg3MTYx*_ga_0YHJK3Y10M*MTc0NDUzMTAyNy4xMy4xLjE3NDQ1MzEzNjYuMC4wLjA.)  
[Link for this project](https://devpost.com/software/wip-y4a1p0)

## What it does
Species Tracker both compiles and processes various data on animals to both inform the user and predict future population trends of each animal.

## How we built it
We built the backend with Python and flask, while the frontend was done in React. The data cleaning and model training was done with Jupyter Notebooks and various Python libraries such as pandas and scikit-learn. Data was gathered from the iNaturalist API.

## What we learned
For most of us, it was the first time combining both back and front-end together, as well as using frameworks such as flask and React.

## What's next
Future features we'd like to add include:
- Discovery feature to randomly generate species for people to learn about, especially those that are considered endangered
- Support more species through collection of more data
- Optimize by caching prior operations to reduce API calls
- List of the currently safe animals at risk of being threatened in the next 10 years
