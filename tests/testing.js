
function eq(o1, o2) { return JSON.stringify(o1) == JSON.stringify(o2) }

function enable_tests() {
  document.getElementsByTagName('main')[0].innerHTML = `
  <div id='testing'>
    <button class='btn' onclick='run_all_tests()'> Run all tests </button>
    <div id='test-results'>
      <h1> Testing report </h1>
      <div id='test-summary'></div>
    </div>
  </div>`
}


let tested = 0
let passed = 0
let failed = 0

function update_test_stats() {
  let c1 = c2 = 'test-passed'
  if (failed > 0)
    c2 = 'test-failed'

  let element = document.getElementById('test-summary')
  element.innerHTML = `
    <h2> Summary </h2>
    <span class="${c1}"> Passed: ${passed} / ${tested} </span>
    <br>
    <span class="${c2}"> Failed: ${failed} / ${tested} </span>
  `
}

function test(f) {
  let element = document.createElement('div')
  element.innerText = f.name
  if (f()) {
    element.classList.add('test-passed')
    passed += 1
  }
  else {
    element.classList.add('test-failed')
    failed += 1
  }
  tested += 1
  update_test_stats()
  document.getElementById('test-results').appendChild(element)
}

function add_group(name) {
  let element = document.createElement('h2')
  element.innerText = name
  document.getElementById('test-results').appendChild(element)
}

function run_all_tests() {
  tested = passed = failed = 0
  enable_tests()
  test_level()
  test_game_logic()
  test_game_state()
  test_loading_and_saving()
}