import React from 'react'
import { StyleSheet } from 'react-native'
import Colors from './Colors'
import FontSize from './FontSize'

export default {

    Styles: StyleSheet.create({

        TEXT_STYLE_DEFAULT: {
            fontSize: FontSize.FONT_SIZE_16,
            color: Colors.COLOR_BLACK,
        },
        TEXT_STYLE_DEFAULT_BOLD: {
            fontSize: FontSize.FONT_SIZE_26,
            color: Colors.COLOR_BLACK,
            fontWeight: 'bold'
        },
        PACKAGE_STYLE: {
            fontSize: FontSize.FONT_SIZE_26,
            color: Colors.COLOR_BLACK,
            fontWeight: 'bold',
            margin: 20
        },
        PACKAGE_TEXT_STYLE: {
            fontSize: FontSize.FONT_SIZE_36,
            color: Colors.COLOR_WHITE,
            fontWeight: 'bold',
            marginTop: 10,
            marginLeft: 20,
            
        },

    })
}