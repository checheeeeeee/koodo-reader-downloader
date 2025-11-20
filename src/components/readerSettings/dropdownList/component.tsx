import React from "react";
import { dropdownList } from "../../../constants/dropdownList";
import "./dropdownList.css";
import { Trans } from "react-i18next";
import { DropdownListProps, DropdownListState } from "./interface";
import { ConfigService } from "../../../assets/lib/kookit-extra-browser.min";
import { loadFontData } from "../../../utils/common";
class DropdownList extends React.Component<
  DropdownListProps,
  DropdownListState
> {
  constructor(props: DropdownListProps) {
    super(props);
    this.state = {
      currentFontFamilyIndex: dropdownList[0].option.findIndex((item: { label: string; value: string }) => {
        return (
          item.value ===
          (ConfigService.getReaderConfig("fontFamily") || "Built-in font")
        );
      }),
      currentLineHeightIndex: dropdownList[1].option.findIndex((item: { label: string; value: string }) => {
        return (
          item.value ===
          (ConfigService.getReaderConfig("lineHeight") || "Default")
        );
      }),
      currentTextAlignIndex: dropdownList[2].option.findIndex((item: { label: string; value: string }) => {
        return (
          item.value ===
          (ConfigService.getReaderConfig("textAlign") || "Default")
        );
      }),
      chineseConversionIndex: dropdownList[3].option.findIndex((item: { label: string; value: string }) => {
        return (
          item.value ===
          (ConfigService.getReaderConfig("convertChinese") || "Default")
        );
      }),
    };
  }
  componentDidMount() {
    loadFontData().then((result) => {
      if (!result || result.length === 0) return;
      dropdownList[0].option = dropdownList[0].option.concat(result);
      this.setState({
        currentFontFamilyIndex: dropdownList[0].option.findIndex(
          (item: { label: string; value: string }) => {
            return (
              item.value ===
              (ConfigService.getReaderConfig("fontFamily") || "Built-in font")
            );
          }
        ),
      });
    });
  }
  handleView(event: React.ChangeEvent<HTMLSelectElement>, option: string) {
    let arr = event.target.value.split("#");
    ConfigService.setReaderConfig(option, arr[0]);
    switch (option) {
      case "fontFamily":
        this.setState({
          currentFontFamilyIndex: parseInt(arr[1], 10),
        });
        if (arr[0] === "Built-in font") {
          ConfigService.setReaderConfig(option, "");
        }
        if (arr[0] === "Load local fonts") {
          loadFontData();
        }

        break;

      case "lineHeight":
        this.setState({
          currentLineHeightIndex: parseInt(arr[1], 10),
        });

        break;
      case "textAlign":
        this.setState({
          currentTextAlignIndex: parseInt(arr[1], 10),
        });

        break;
      case "convertChinese":
        this.setState({
          chineseConversionIndex: parseInt(arr[1], 10),
        });

        break;
      default:
        break;
    }
    this.props.renderBookFunc();
  }
  render() {
    const renderParagraphCharacter = () => {
      return dropdownList.map((item) => (
        <li className="paragraph-character-container" key={item.id}>
          <p className="general-setting-title">
            <Trans>{item.title}</Trans>
          </p>
          <select
            name=""
            className="general-setting-dropdown"
            onChange={(event) => {
              this.handleView(event, item.value);
            }}
            value={(
              () => {
                const selectedIndex =
                  item.value === "lineHeight"
                    ? this.state.currentLineHeightIndex
                    : item.value === "textAlign"
                    ? this.state.currentTextAlignIndex
                    : item.value === "convertChinese"
                    ? this.state.chineseConversionIndex
                    : this.state.currentFontFamilyIndex;
                const opt = item.option[selectedIndex];
                return opt ? `${opt.value}#${selectedIndex}` : "";
              }
            )()}
          >
            {item.option.map(
              (
                subItem: {
                  label: string;
                  value: string;
                },
                index: number
              ) => (
                <option
                  value={subItem.value + "#" + index.toString()}
                  key={index}
                  className="general-setting-option"
                >
                  {this.props.t(subItem.label)}
                </option>
              )
            )}
          </select>
        </li>
      ));
    };

    return (
      <ul className="paragraph-character-setting">
        {renderParagraphCharacter()}
      </ul>
    );
  }
}

export default DropdownList;
