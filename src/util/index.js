export function scanComponents(context) {
  const components = {};
  const sorter = [];

  context.keys().forEach((key) => {
    const componentName = key.substring(2, key.length - 4);
    const component = context(key).default;
    components[componentName] = component;
    sorter.push({
      name: componentName,
      index: component.componentIndex == undefined ? 0 : component.componentIndex,
    });
  });
  sorter.sort((a, b) => a.index - b.index);
  const componentList = sorter.map((obj) => obj.name);
  return {
    componentList,
    components
  }
}
