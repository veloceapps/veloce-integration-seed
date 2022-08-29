@(split="TRUE")
type Bundle {
	port phones : Phone [0..10] {
	}
}

@(split="TRUE")
type Phone {
  string color = ["White", "Black", "Red"];
}

type iPhone13 : Phone {}
type GalaxyS22 : Phone {}
type OnePlus10Pro : Phone {}
type Pixel6 : Phone {}