/*
 * Copyright 1999-2011 Alibaba Group Holding Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.alibaba.druid.bvt.sql.postgresql;

import junit.framework.Assert;
import junit.framework.TestCase;

import com.alibaba.druid.sql.SQLUtils;
import com.alibaba.druid.util.JdbcUtils;

public class PGFormatTest extends TestCase {

    public void test_0() throws Exception {
        String sql = "CREATE TABLE foo (fooid int, foosubid int, fooname text);";
        String formatedSql = SQLUtils.format(sql, JdbcUtils.POSTGRESQL);
        Assert.assertEquals("CREATE TABLE foo (\n" + //
                            "\tfooid int, \n" + //
                            "\tfoosubid int, \n" + //
                            "\tfooname text\n" + //
                            ")", formatedSql);
    }
}