const bigTitle = {
  content: `
    <style>
    * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }
  
  .container {
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
  
    @media screen and (min-width: 481px) {
      max-width: 540px;
    }
  
    @media screen and (min-width: 769px) {
      max-width: 720px;
    }
  
    @media screen and (min-width: 981px) {
      max-width: 960px;
    }
  }
  
  .wm-hero {
    --duration1: 2.5s;
    --duration2: calc(var(--duration1) / 2);
    --delay1: calc(var(--duration2) / 2);
    --delay2: calc(var(--duration2) + var(--delay1));
    --easing: cubic-bezier(0.65, 0.05, 0.36, 1);
    background-color: wheat;
    overflow: hidden;
    text-align: center;
  
    h1 {
      font-size: 36px;
      font-weight: 600;
      line-height: 1.2;
      margin-top: 2em;
      margin-bottom: 2em;
      opacity: 0;
      transform: translateY(3em);
      animation: loadH1 var(--duration1) var(--easing) var(--delay1) forwards;
  
      @media screen and (min-width: 981px) {
        font-size: 56px;
      }
    }
    
    img {
      display: block;
      max-width: 100%;
      height: auto;
      border-radius: 1em 1em 0 0;
      transform: translateY(100%);
      animation: loadImg var(--duration2) var(--easing) var(--delay2) forwards;
    }
  }
  
  @keyframes loadH1 {
    0% {
      opacity: 0;
      transform: translateY(3em);
    }
    30%,
    50% {
      opacity: 1;
      transform: translateY(3em);
    }
    100% {
      opacity: 1;
      transform: none; 
    }
  }
  
  @keyframes loadImg {
    0% {
      transform: translateY(100%);
    }
    100% {
      transform: none; 
    }
  }
    </style>

    <div class="wm-hero js-animate">
    <div class="wm-hero__inner container">
        <h1>Big text goes here</h1><img src="https://api.lorem.space/image/album?w=960&amp;h=600" alt="Random cover album" width="960" height="600" /></div>
</div>
`,
};

export { bigTitle };
