function ModuleTabs({ active, items, onChange }) {
  return (
    <div className="module-tabs" role="tablist">
      {items.map((item, index) => (
        <button
          className={`module-tab${active === index ? ' is-active' : ''}`}
          key={item}
          type="button"
          role="tab"
          aria-selected={active === index}
          onClick={() => onChange(index)}
        >
          {item}
        </button>
      ))}
    </div>
  )
}

export default ModuleTabs
