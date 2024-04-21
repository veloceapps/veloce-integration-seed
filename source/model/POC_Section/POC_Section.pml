type Bundle {
    string bundleName;
    @(domainComputation="Before")
    string country = ["Latvia", "Lithuania", "Estonia"];

    @(defaultvalue="Alaska, New York", domainComputation="Before")
    string[] states = ["Alaska", "Alabama", "Arkansas", "American Samoa", "Arizona", "California", "Colorado", "Connecticut", "District of Columbia", "Delaware", "Florida", "Georgia", "Guam", "Hawaii", "Iowa", "Idaho", "Illinois", "Indiana", "Kansas", "Kentucky", "Louisiana", "Massachusetts", "Maryland", "Maine", "Michigan", "Minnesota", "Missouri", "Mississippi", "Montana", "North Carolina", "North Dakota", "Nebraska", "New Hampshire", "New Jersey", "New Mexico", "Nevada", "New York"];

    @(domainComputation="true", priceOptions="true")
    port Phones : Phone [0..10] {
    }

    @(domainComputation="true", priceOptions="true")
    port Plans : Plan [0..1] {
    }

    @(domainComputation="true", priceOptions="true")
    port Deliveries : Delivery [0..1] {
    }

}

type Phone {
    @(domainComputation="Before")
    string color = ["Black","White","Pink"];
    @(domainComputation="Before")
    string ram = ["4 GB", "8 GB", "12 GB"];
    string screenSize = "6.7";
    @(domainComputation="Before")
    string SIM_Count = ["1", "2"];
    string comments;
    @(column="Addons for phone", domainComputation="Before")
    string[] addons = ["Case", "Contract", "Glass", "Wireless Charger"];

    @(domainComputation="Before")
    string[] addonsForLife = ["Extended Warranty", "Insurance", "Digital TV"];

    @(domainComputation="true", priceOptions="true")
    port Accessories : Accessory [0..2] {
    }
}

type Accessory {
    @(domainComputation="Before")
    string power = ["3W","5W"];
    @(domainComputation="Before")
    string color = ["Black","White"];

    @(domainComputation="true", priceOptions="true")
    port Cares : Care [0..2] {
    }
}

type Care {
}

type Plan {
}

type Delivery {
}
