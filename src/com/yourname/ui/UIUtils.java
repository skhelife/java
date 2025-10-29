package com.yourname.ui;

/**
 * UI工具类
 * 提供各种美化界面的工具方法
 */
public class UIUtils {
    
    // 是否启用 Unicode / Emoji / 箱线字符（默认启用以获得更好的视觉效果）
    public static boolean ENABLE_UNICODE = true;

    // ANSI颜色代码
    public static final String RESET = "\033[0m";
    public static final String BLACK = "\033[0;30m";
    public static final String RED = "\033[0;31m";
    public static final String GREEN = "\033[0;32m";
    public static final String YELLOW = "\033[0;33m";
    public static final String BLUE = "\033[0;34m";
    public static final String PURPLE = "\033[0;35m";
    public static final String CYAN = "\033[0;36m";
    public static final String WHITE = "\033[0;37m";
    
    // 加粗颜色
    public static final String BOLD_BLACK = "\033[1;30m";
    public static final String BOLD_RED = "\033[1;31m";
    public static final String BOLD_GREEN = "\033[1;32m";
    public static final String BOLD_YELLOW = "\033[1;33m";
    public static final String BOLD_BLUE = "\033[1;34m";
    public static final String BOLD_PURPLE = "\033[1;35m";
    public static final String BOLD_CYAN = "\033[1;36m";
    public static final String BOLD_WHITE = "\033[1;37m";
    
    // 背景颜色
    public static final String BG_BLACK = "\033[40m";
    public static final String BG_RED = "\033[41m";
    public static final String BG_GREEN = "\033[42m";
    public static final String BG_YELLOW = "\033[43m";
    public static final String BG_BLUE = "\033[44m";
    public static final String BG_PURPLE = "\033[45m";
    public static final String BG_CYAN = "\033[46m";
    public static final String BG_WHITE = "\033[47m";
    
    /**
     * 切换是否使用 Unicode 字符（如箱线、表情）以避免在不支持的终端显示为问号
     */
    public static void setEnableUnicode(boolean enable) {
        ENABLE_UNICODE = enable;
    }

    /**
     * 清屏
     */
    public static void clearScreen() {
        System.out.print("\033[2J\033[H");
        System.out.flush();
    }
    
    /**
     * 打印彩色文本
     * @param text 文本内容
     * @param color 颜色代码
     */
    public static void printColored(String text, String color) {
        System.out.print(color + sanitize(text) + RESET);
    }
    
    /**
     * 打印彩色文本并换行
     * @param text 文本内容
     * @param color 颜色代码
     */
    public static void printColoredLine(String text, String color) {
        System.out.println(color + sanitize(text) + RESET);
    }
    
    /**
     * 如果终端不支持 Unicode，可使用 ASCII 回退
     */
    private static String sanitize(String text) {
        if (ENABLE_UNICODE || text == null) return text;
        // 先做常见字符替换
        String asciiText = text.replace("┌", "+")
                   .replace("┐", "+")
                   .replace("└", "+")
                   .replace("┘", "+")
                   .replace("─", "-")
                   .replace("│", "|")
                   .replace("┬", "+")
                   .replace("┴", "+")
                   .replace("├", "+")
                   .replace("┤", "+")
                   .replace("┼", "+")
                   .replace("▓", "#")
                   .replace("░", ".")
                   .replace("╔", "+")
                   .replace("╗", "+")
                   .replace("╚", "+")
                   .replace("╝", "+")
                   .replace("🎓", "【学位帽】")
                   .replace("🚀", "【火箭】")
                   .replace("📊", "【图表】")
                   .replace("📈", "【上升】")
                   .replace("🔍", "【搜索】")
                   .replace("🏆", "【奖杯】")
                   .replace("📋", "【清单】")
                   .replace("🎯", "【目标】")
                   .replace("❌", "【关闭】")
                   .replace("✨", "【闪光】")
                   .replace("✅", "【完成】")
                   .replace("⚠️", "【警告】")
                   .replace("ℹ️", "【信息】")
                   .replace("⏸️", "【暂停】")
                   .replace("🌟", "【星星】")
                   .replace("💯", "【满分】")
                   .replace("🎉", "【庆祝】")
                   .replace("👋", "【挥手】")
                   .replace("📚", "【书本】")
                   .replace("👥", "【人群】")
                   .replace("🥇", "【金牌】")
                   .replace("🥈", "【银牌】")
                   .replace("🥉", "【铜牌】")
                   .replace("🏅", "【奖章】")
                   .replace("⚙️", "【设置】")
                   .replace("▓", "#")
                   .replace("░", ".");
        // 智能清理：保留中文和常用字符，避免出现"?"
        StringBuilder sb = new StringBuilder();
        int i = 0;
        final int len = asciiText.length();
        while (i < len) {
            int cp = asciiText.codePointAt(i);
            // 允许更多字符：ASCII、中文、日文、韩文、全角字符、特殊符号
            boolean allowed = 
                    (cp >= 32 && cp <= 126) ||                    // 基本ASCII
                    cp == '\t' || cp == '\n' || cp == '\r' ||     // 控制字符
                    (cp >= 0x4E00 && cp <= 0x9FFF) ||            // 中文汉字
                    (cp >= 0x3000 && cp <= 0x303F) ||            // CJK符号
                    (cp >= 0xFF00 && cp <= 0xFFEF) ||            // 全角字符
                    (cp >= 0x2500 && cp <= 0x257F) ||            // 框线字符
                    (cp >= 0x2580 && cp <= 0x259F) ||            // 块状字符
                    (cp >= 0x25A0 && cp <= 0x25FF) ||            // 几何图形
                    (cp >= 0x2600 && cp <= 0x26FF) ||            // 杂项符号
                    (cp >= 0x2700 && cp <= 0x27BF);              // 装饰符号
                    
            if (allowed) {
                sb.appendCodePoint(cp);
            } else {
                // 用相似的字符替换，而不是"?"
                if (cp >= 0x1F600 && cp <= 0x1F64F) {
                    sb.append("(^_^)"); // 表情符号用笑脸
                } else if (cp >= 0x1F300 && cp <= 0x1F5FF) {
                    sb.append("[*]");   // 各种符号用星号
                } else {
                    sb.append("*");     // 其他未知字符用星号
                }
            }
            i += Character.charCount(cp);
        }
        return sb.toString();
    }
    
    /**
     * 估算字符串在控制台的显示宽度（中文/Emoji按2宽度处理）
     */
    public static int displayWidth(String s) {
        if (s == null || s.isEmpty()) return 0;
        
        // 如果禁用Unicode，直接返回字符长度（适用于纯ASCII环境）
        if (!ENABLE_UNICODE) {
            return s.length();
        }
        
        int width = 0;
        int i = 0;
        final int len = s.length();
        while (i < len) {
            int cp = s.codePointAt(i);
            // 更精确的宽度计算
            if (cp <= 0x1F || (cp >= 0x7F && cp <= 0x9F)) {
                // 控制字符，宽度为0
                width += 0;
            } else if (cp <= 0xFF) {
                // ASCII字符，宽度为1
                width += 1;
            } else if (isEastAsianFullwidth(cp) || isEmoji(cp)) {
                // 中文、日文、韩文、全角符号、Emoji，宽度为2
                width += 2;
            } else {
                // 其他Unicode字符，宽度为1
                width += 1;
            }
            i += Character.charCount(cp);
        }
        return width;
    }
    
    /**
     * 判断是否为东亚全角字符
     */
    private static boolean isEastAsianFullwidth(int cp) {
        // 中文汉字范围
        if (cp >= 0x4E00 && cp <= 0x9FFF) return true;
        // 日文假名
        if (cp >= 0x3040 && cp <= 0x309F) return true; // 平假名
        if (cp >= 0x30A0 && cp <= 0x30FF) return true; // 片假名
        // 韩文
        if (cp >= 0xAC00 && cp <= 0xD7AF) return true;
        // 全角符号
        if (cp >= 0xFF00 && cp <= 0xFFEF) return true;
        // 其他CJK扩展
        if (cp >= 0x3400 && cp <= 0x4DBF) return true; // CJK扩展A
        if (cp >= 0x20000 && cp <= 0x2A6DF) return true; // CJK扩展B
        return false;
    }
    
    /**
     * 判断是否为Emoji字符
     */
    private static boolean isEmoji(int cp) {
        // Emoji基本范围
        if (cp >= 0x1F600 && cp <= 0x1F64F) return true; // 表情符号
        if (cp >= 0x1F300 && cp <= 0x1F5FF) return true; // 各种符号
        if (cp >= 0x1F680 && cp <= 0x1F6FF) return true; // 交通和地图符号
        if (cp >= 0x1F700 && cp <= 0x1F77F) return true; // 炼金术符号
        if (cp >= 0x1F780 && cp <= 0x1F7FF) return true; // 几何图形扩展
        if (cp >= 0x1F800 && cp <= 0x1F8FF) return true; // 补充箭头-C
        if (cp >= 0x1F900 && cp <= 0x1F9FF) return true; // 补充符号和象形文字
        if (cp >= 0x1FA00 && cp <= 0x1FA6F) return true; // 象棋符号
        if (cp >= 0x1FA70 && cp <= 0x1FAFF) return true; // 符号和象形文字扩展-A
        // 其他常见emoji范围
        if (cp >= 0x2600 && cp <= 0x26FF) return true; // 杂项符号
        if (cp >= 0x2700 && cp <= 0x27BF) return true; // 装饰符号
        return false;
    }
    
    /**
     * 将字符串截断到指定的显示宽度（不破坏 surrogate pair）
     */
    public static String truncateToWidth(String s, int maxWidth) {
        if (s == null) return "";
        StringBuilder sb = new StringBuilder();
        int width = 0;
        int i = 0;
        final int len = s.length();
        while (i < len && width < maxWidth) {
            int cp = s.codePointAt(i);
            int w = (cp <= 0xFF) ? 1 : 2;
            if (width + w > maxWidth) break;
            sb.appendCodePoint(cp);
            width += w;
            i += Character.charCount(cp);
        }
        // 如果不足宽度可以填充空格（由调用方决定）
        return sb.toString();
    }

    /**
     * 打印炫酷的标题
     * @param title 标题内容
     */
    public static void printFancyTitle(String title) {
        String t = sanitize(title);
        int contentWidth = Math.max(displayWidth(t), 60);
        int boxWidth = contentWidth + 8;
        
        System.out.println();
        
        // 超炫酷的3D立体标题框（使用兼容字符）
        printColoredLine("====" + repeatChar('=', boxWidth) + "====", BG_CYAN + BOLD_WHITE);
        printColoredLine("==  " + repeatChar('#', boxWidth) + "  ==", BG_CYAN + BOLD_BLUE);
        printColoredLine("==  #" + repeatChar(' ', boxWidth - 2) + "#  ==", BG_CYAN + BOLD_BLUE);
        printColoredLine("==  #" + centerText(t, boxWidth - 2) + "#  ==", BG_CYAN + BOLD_YELLOW);
        printColoredLine("==  #" + repeatChar(' ', boxWidth - 2) + "#  ==", BG_CYAN + BOLD_BLUE);
        printColoredLine("==  " + repeatChar('#', boxWidth) + "  ==", BG_CYAN + BOLD_BLUE);
        printColoredLine("====" + repeatChar('=', boxWidth) + "====", BG_CYAN + BOLD_WHITE);
        
        System.out.println();
        
        // 添加酷炫的动态效果线
        for (int i = 0; i < boxWidth + 8; i++) {
            String[] effects = {"=", "-", "#", "|", "\\", "/", "+"};
            printColored(effects[i % effects.length], BOLD_YELLOW);
        }
        System.out.println();
        System.out.println();
    }
    
    private static String repeatChar(char c, int count) {
        StringBuilder sb = new StringBuilder(count);
        for (int i = 0; i < count; i++) sb.append(c);
        return sb.toString();
    }
    
    /**
     * 打印分隔线
     * @param length 长度
     * @param character 字符
     * @param color 颜色
     */
    public static void printSeparator(int length, String character, String color) {
        String line = repeatChar(character.charAt(0), length);
        printColoredLine(line, color);
    }
    
    /**
     * 打印渐变分隔线
     * @param length 长度
     */
    public static void printGradientSeparator(int length) {
        String[] colors = {BLUE, CYAN, GREEN, YELLOW, RED, PURPLE};
        for (int i = 0; i < length; i++) {
            String color = colors[i % colors.length];
            printColored("=", color);
        }
        System.out.println();
    }
    
    /**
     * 打印系统横幅
     */
    public static void printSystemBanner() {
        clearScreen();
        
        // 打印超级炫酷的ASCII艺术标题
        printColoredLine("", RESET);
        printColoredLine("================================================================================", BG_BLUE + BOLD_WHITE);
        printColoredLine("#                                                                              #", BG_BLUE + BOLD_WHITE);
        printColoredLine("#                     学生成绩管理系统 v2.0 - 至尊版                           #", BG_BLUE + BOLD_YELLOW);
        printColoredLine("#                     STUDENT MANAGEMENT SYSTEM                               #", BG_BLUE + BOLD_YELLOW);
        printColoredLine("#                                                                              #", BG_BLUE + BOLD_YELLOW);
        printColoredLine("#                     欢迎使用教务管理系统！                                    #", BG_BLUE + BOLD_YELLOW);
        printColoredLine("#                     Welcome to use!                                         #", BG_BLUE + BOLD_YELLOW);
        printColoredLine("#                                                                              #", BG_BLUE + BOLD_YELLOW);
        printColoredLine("#                                                                              #", BG_BLUE + BOLD_WHITE);
        printColoredLine("#              ★★★ 学生成绩管理系统 v2.0 - 至尊版 ★★★                    #", BG_BLUE + BOLD_RED);
        printColoredLine("#                    Student Grade Management System                          #", BG_BLUE + BOLD_GREEN);
        printColoredLine("#                          >>> Enhanced Edition <<<                          #", BG_BLUE + BOLD_CYAN);
        printColoredLine("#                                                                              #", BG_BLUE + BOLD_WHITE);
        printColoredLine("================================================================================", BG_BLUE + BOLD_WHITE);
        
        printColoredLine("", RESET);
        
        // 超炫酷的动态分隔线
        for (int i = 0; i < 80; i++) {
            String[] fireColors = {BOLD_RED, BOLD_YELLOW, BOLD_WHITE, BOLD_CYAN, BOLD_BLUE, BOLD_PURPLE};
            printColored("=", fireColors[i % fireColors.length]);
        }
        System.out.println();
        System.out.println();
    }
    
    /**
     * 打印主菜单
     */
    public static void printMainMenu() {
        // 超炫酷的3D效果菜单
        printColoredLine("", RESET);
        printColoredLine("================================================================================", BG_BLACK + BOLD_CYAN);
        printColoredLine("#                                                                              #", BG_BLACK + BOLD_CYAN);
        printColoredLine("#                           主菜单 - SUPER MENU                               #", BG_BLACK + BOLD_YELLOW);
        printColoredLine("#                        欢迎使用学生管理系统！                               #", BG_BLACK + BOLD_YELLOW);
        printColoredLine("#                        Welcome to Student System!                          #", BG_BLACK + BOLD_YELLOW);
        printColoredLine("#                        请选择您需要的功能：                                 #", BG_BLACK + BOLD_YELLOW);
        printColoredLine("#                        Please select a function:                           #", BG_BLACK + BOLD_YELLOW);
        printColoredLine("#                                                                              #", BG_BLACK + BOLD_YELLOW);
        printColoredLine("#                                                                              #", BG_BLACK + BOLD_CYAN);
        printColoredLine("================================================================================", BG_BLACK + BOLD_CYAN);
        
        System.out.println();
        
        // 炫酷的选项菜单
        printColoredLine("+==============================================================================+", BOLD_BLUE);
        printColoredLine("|                              ★ 功能选择区域 ★                              |", BG_BLUE + BOLD_WHITE);
        printColoredLine("+==============================================================================+", BOLD_BLUE);
        printColoredLine("|                                                                              |", BOLD_BLUE);
        printColoredLine("|     [1] ==== 查看教学班成绩 ====        [3] ==== 查询学生成绩 ====         |", BOLD_GREEN);
        printColoredLine("|                                                                              |", BOLD_BLUE);
        printColoredLine("|     [2] ==== 成绩分布统计 ====          [4] ==== 学生总成绩排名 ====       |", BOLD_CYAN);
        printColoredLine("|                                                                              |", BOLD_BLUE);
        printColoredLine("|     [5] ==== 教学班信息总览 ====        [6] ==== 系统统计信息 ====         |", BOLD_PURPLE);
        printColoredLine("|                                                                              |", BOLD_BLUE);
        printColoredLine("|                          [7] #### 退出系统 ####                           |", BOLD_RED);
        printColoredLine("|                                                                              |", BOLD_BLUE);
        printColoredLine("+==============================================================================+", BOLD_BLUE);
        
        System.out.println();
        
        // 炫酷的输入提示
        printColored(">>> ", BOLD_RED);
        printColored("请输入您的选择", BOLD_YELLOW);
        printColored(" (1-7)", BOLD_GREEN);
        printColored(": ", BOLD_WHITE);
    }
    
    /**
     * 打印成功消息
     * @param message 消息内容
     */
    public static void printSuccess(String message) {
        printColoredLine("【完成】 " + message, BOLD_GREEN);
    }
    
    /**
     * 打印错误消息
     * @param message 消息内容
     */
    public static void printError(String message) {
        printColoredLine("【关闭】 " + message, BOLD_RED);
    }
    
    /**
     * 打印警告消息
     * @param message 消息内容
     */
    public static void printWarning(String message) {
        printColoredLine("【警告】 " + message, BOLD_YELLOW);
    }
    
    /**
     * 打印信息消息
     * @param message 消息内容
     */
    public static void printInfo(String message) {
        printColoredLine("【信息】 " + message, BOLD_BLUE);
    }
    
    /**
     * 文本居中（按显示宽度）
     * @param text 文本
     * @param width 宽度
     * @return 居中的文本
     */
    public static String centerText(String text, int width) {
        String t = sanitize(text);
        int w = displayWidth(t);
        if (w >= width) return t;
        int padding = (width - w) / 2;
        return repeatChar(' ', padding) + t + repeatChar(' ', width - padding - w);
    }
    
    /**
     * 文本右对齐填充（按显示宽度）
     */
    public static String padRight(String text, int width) {
        String t = sanitize(text);
        int w = displayWidth(t);
        if (w >= width) return truncateToWidth(t, width);
        return t + repeatChar(' ', width - w);
    }
    
    /**
     * 文本左对齐填充（按显示宽度）
     */
    public static String padLeft(String text, int width) {
        String t = sanitize(text);
        int w = displayWidth(t);
        if (w >= width) return truncateToWidth(t, width);
        return repeatChar(' ', width - w) + t;
    }
    
    /**
     * 打印超炫酷的加载动画
     * @param message 加载消息
     */
    public static void printLoadingAnimation(String message) {
        String[] fireSpinner = {"#---------", "##--------", "###-------", "####------", 
                               "#####-----", "######----", "#######---", "########--",
                               "#########-", "##########"};
        String[] colors = {BOLD_RED, BOLD_YELLOW, BOLD_GREEN, BOLD_CYAN, BOLD_BLUE, BOLD_PURPLE};
        
        for (int i = 0; i < 30; i++) {
            String color = colors[i % colors.length];
            String bar = fireSpinner[Math.min(i / 3, fireSpinner.length - 1)];
            System.out.print("\r" + color + ">>> " + bar + " " + sanitize(message) + " <<<" + RESET);
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        System.out.println("\r" + BOLD_GREEN + ">>> ########## " + sanitize(message) + " 完成！ <<<" + RESET);
    }
    
    /**
     * 打印表格头部
     * @param headers 表头
     * @param widths 列宽
     */
    public static void printTableHeader(String[] headers, int[] widths) {
        // 打印顶部边框
        printColored("┌", BOLD_BLUE);
        for (int i = 0; i < headers.length; i++) {
            printColored(repeatChar('─', widths[i]), BOLD_BLUE);
            if (i < headers.length - 1) {
                printColored("┬", BOLD_BLUE);
            }
        }
        printColoredLine("┐", BOLD_BLUE);
        
        // 打印表头
        printColored("│", BOLD_BLUE);
        for (int i = 0; i < headers.length; i++) {
            printColored(centerText(headers[i], widths[i]), BOLD_YELLOW);
            printColored("│", BOLD_BLUE);
        }
        System.out.println();
        
        // 打印分隔线
        printColored("├", BOLD_BLUE);
        for (int i = 0; i < headers.length; i++) {
            printColored(repeatChar('─', widths[i]), BOLD_BLUE);
            if (i < headers.length - 1) {
                printColored("┼", BOLD_BLUE);
            }
        }
        printColoredLine("┤", BOLD_BLUE);
    }
    
    /**
     * 打印表格行
     * @param data 数据
     * @param widths 列宽
     * @param isAlternate 是否交替行
     */
    public static void printTableRow(String[] data, int[] widths, boolean isAlternate) {
        String color = isAlternate ? WHITE : BOLD_WHITE;
        printColored("│", BOLD_BLUE);
        for (int i = 0; i < data.length; i++) {
            String cell = sanitize(data[i]);
            // 确保单元格内容不超出列宽
            int availableWidth = widths[i] - 2; // 减去左右各一个空格
            String cellContent;
            
            // 在ASCII模式下，使用字符长度而不是显示宽度
            int cellWidth = ENABLE_UNICODE ? displayWidth(cell) : cell.length();
            
            if (cellWidth > availableWidth) {
                if (ENABLE_UNICODE) {
                    cellContent = truncateToWidth(cell, availableWidth);
                } else {
                    // ASCII模式下简单截断
                    cellContent = cell.length() > availableWidth ? cell.substring(0, availableWidth) : cell;
                }
            } else {
                cellContent = cell;
            }
            
            // 计算需要填充的空格数
            int contentWidth = ENABLE_UNICODE ? displayWidth(cellContent) : cellContent.length();
            int paddingSpaces = Math.max(0, availableWidth - contentWidth);
            
            // 打印单元格：空格 + 内容 + 填充空格 + 空格
            printColored(" " + cellContent + repeatChar(' ', paddingSpaces) + " ", color);
            printColored("│", BOLD_BLUE);
        }
        System.out.println();
    }
    
    /**
     * 打印表格底部
     * @param widths 列宽
     */
    public static void printTableFooter(int[] widths) {
        printColored("└", BOLD_BLUE);
        for (int i = 0; i < widths.length; i++) {
            printColored(repeatChar('─', widths[i]), BOLD_BLUE);
            if (i < widths.length - 1) {
                printColored("┴", BOLD_BLUE);
            }
        }
        printColoredLine("┘", BOLD_BLUE);
    }
    
    /**
     * 等待用户按回车
     */
    public static void waitForEnter() {
        printColored("\n⏸️  按回车键继续...", BOLD_CYAN);
        try {
            // 清空输入缓冲区
            while (System.in.available() > 0) {
                System.in.read();
            }
            // 等待用户输入
            System.in.read();
            // 再次清空缓冲区
            while (System.in.available() > 0) {
                System.in.read();
            }
        } catch (Exception e) {
            // 忽略异常
        }
    }
}
