<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>

html,
body{
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: #2c3e50;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
.flex{
  display: flex;
  justify-content: center;
  align-items: center;
}
/* 像素小于320px */
@media screen and (max-width: 320px){
  html {
    font-size: 11px;
  }
}

/* 像素最小320px */
@media screen and (min-width: 320px){
  html {
    font-size: 11px;
  }
}
/* 像素最小375px */
@media screen and (min-width: 375px) {
  html {
    font-size: 12px;
  }
}

/* 像素最小414pxpx */
@media screen and (min-width: 414px) {
  html {
    font-size: 15px;
  }
}

/* 像素最小640pxpx */
@media screen and (min-width: 640px) {
  html {
    font-size: 20px;
  }
}

/* 像素最小720pxpx */
@media screen and (min-width: 720px) {
  html {
    font-size: 22.5px;
  }
}

/* 像素最小750pxpx */
@media screen and (min-width: 750px) {
  html {
    font-size: 23.5px;
  }
}

</style>
