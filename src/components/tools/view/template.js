import '../images/swap.png';

export default `<div class="tool_sizes_box">
    <div class="tool_sizes_box-size tool_sizes_box-size--1 tool_sizes_box-size--active" data-size="1"
    title="1px"><div class="tool_sizes_box-inner_size"></div></div>
    <div class="tool_sizes_box-size tool_sizes_box-size--2" data-size="2"
     title="2px"><div class="tool_sizes_box-inner_size"></div></div>
    <div class="tool_sizes_box-size tool_sizes_box-size--3" data-size="3"
    title="3px"><div class="tool_sizes_box-inner_size"></div></div>
    <div class="tool_sizes_box-size tool_sizes_box-size--4" data-size="4"
    title="4px"><div class="tool_sizes_box-inner_size"></div></div>
  </div>
  
  <div class="panel"></div>
  
  <div class="color_panel"> 
    <input type='color' class="primary-color" id="primary-color" name="primary-color"
     value="#317617" title="primary color">
    <img class="swap-icon" id="swap" src="src/components/tools/images/swap.png"
           height="20" width="20" alt="swap color icon" title="swap color">
    <input type='color' class="secondary-color" id="secondary-color" name="secondary-color"
     value="#fff71f" title="secondary color">
  </div>`;
