// Keywords and built-in names per language, from the Monaco Editor's
// basic-languages (MIT, Microsoft; THIRD-PARTY-NOTICES.md): the word lists
// of monaco-editor 0.52.2, joined per language.
(function (root) {
  root.codeWords = {
    languages: {
      python: {
        name: "Python",
        words:
          "False None True __bases__ __class__ __dict__ __import__ __init__ __members__ __methods__ __mro__ __name__ __subclasses__ abs all and any apply as assert async await basestring bin bool break buffer bytearray callable case chr class classmethod cmp coerce compile complex continue def del delattr dict dir divmod elif else enumerate eval except exec execfile file filter finally float for format from frozenset getattr global globals hasattr hash help hex id if import in input int intern is isinstance issubclass iter lambda len list locals long map match max memoryview min next nonlocal not object oct open or ord pass pow print property raise range raw_input reduce reload repr return reversed round self set setattr slice sorted staticmethod str sum super try tuple type unichr unicode vars while with xrange yield zip",
      },
      javascript: {
        name: "JavaScript",
        words:
          "async await break case catch class const constructor continue debugger default delete do else export extends false finally for from function get if import in instanceof let new null of return set static super switch symbol this throw true try typeof undefined var void while with yield",
      },
      typescript: {
        name: "TypeScript",
        words:
          "abstract any as asserts async await bigint boolean break case catch class const constructor continue debugger declare default delete do else enum export extends false finally for from function get global if implements import in infer instanceof interface is keyof let module namespace never new null number object of out override package private protected public readonly require return satisfies set static string super switch symbol this throw true try type typeof undefined unique unknown var void while with yield",
      },
      java: {
        name: "Java",
        words:
          "abstract assert boolean break byte case catch char class const continue default do double else enum extends false final finally float for goto if implements import instanceof int interface long native new non-sealed package permits private protected public record return sealed short static strictfp super switch synchronized this throw throws transient true try void volatile while yield",
      },
      cpp: {
        name: "C/C++",
        words:
          "__abstract __alignof __asm __assume __based __box __builtin_alignof __cdecl __clrcall __declspec __delegate __event __except __fastcall __finally __forceinline __gc __hook __identifier __if_exists __if_not_exists __inline __int128 __int16 __int32 __int64 __int8 __interface __leave __m128 __m128d __m128i __m256 __m256d __m256i __m512 __m512d __m512i __m64 __multiple_inheritance __newslot __nogc __noop __nounwind __novtordisp __nullptr __pascal __pin __pragma __property __ptr32 __ptr64 __raise __restrict __resume __sealed __single_inheritance __stdcall __super __thiscall __try __try_cast __typeof __unaligned __unhook __uuidof __value __virtual_inheritance __w64 __wchar_t _asm _based _cdecl _declspec _fastcall _if_exists _if_not_exists _inline _multiple_inheritance _pascal _single_inheritance _stdcall _virtual_inheritance _w64 abstract amp array auto bool break case catch char class const const_cast constexpr continue cpu decltype default delegate delete do double dynamic_cast each else enum event explicit export extern false final finally float for friend gcnew generic goto if in initonly inline int interface interior_ptr internal literal long mutable namespace new noexcept nullptr operator override partial pascal pin_ptr private property protected public ref register reinterpret_cast restrict return safe_cast sealed short signed sizeof static static_assert static_cast struct switch template this thread_local throw tile_static true try typedef typeid typename union unsigned using virtual void volatile wchar_t where while",
      },
      csharp: {
        name: "C#",
        words:
          "abstract add alias as ascending assembly async await base bool break by byte case catch char checked class const continue decimal default delegate descending do double dynamic else enum equals event explicit extern false field finally fixed float for foreach from get goto group if implicit in int interface internal into is join let lock long method nameof namespace new null object on operator orderby out override param params partial private protected public readonly ref remove return sbyte sealed select set short sizeof stackalloc static string struct switch this throw true try typeof uint ulong unchecked unsafe ushort using var virtual void volatile when where while yield",
      },
      go: {
        name: "Go",
        words:
          "bool break byte case chan complex128 complex64 const continue default defer else fallthrough false float32 float64 for func go goto if import int int16 int32 int64 int8 interface map nil package range return rune select string struct switch true type uint uint16 uint32 uint64 uint8 uintptr var",
      },
      rust: {
        name: "Rust",
        words:
          "BUFSIZ DIR EOF EXIT_FAILURE EXIT_SUCCESS Either Err FILE FILENAME_MAX FOPEN_MAX F_OK L_tmpnam Left None O_APPEND O_CREAT O_EXCL O_RDONLY O_RDWR O_TRUNC O_WRONLY Ok Option RAND_MAX R_OK Right SEEK_CUR SEEK_END SEEK_SET STDERR_FILENO STDIN_FILENO STDOUT_FILENO S_IEXEC S_IFBLK S_IFCHR S_IFDIR S_IFIFO S_IFMT S_IFREG S_IREAD S_IRUSR S_IRWXU S_IWRITE S_IWUSR S_IXUSR Self Some TMP_MAX W_OK X_OK _IOFBF _IOLBF _IONBF abstract alignof as async await become bool box break c_char c_double c_float c_int c_long c_longlong c_schar c_short c_uchar c_uint c_ulong c_ulonglong c_ushort c_void catch char clock_t const continue crate default dev_t dirent do dyn else enum extern f128 f16 f32 f64 f80 false final float fn for fpos_t i16 i32 i64 i8 if impl in ino_t int intptr_t let loop m128 m32 m64 macro match mod mode_t move mut off_t offsetof override pid_t priv proc ptrdiff_t pub pure ref return self size_t sizeof ssize_t static str struct super time_t trait true try type typeof u16 u32 u64 u8 uint uintptr_t union unsafe unsized use virtual where while yield",
      },
      kotlin: {
        name: "Kotlin",
        words:
          "abstract actual annotation as break by catch class companion const constructor continue crossinline data delegate do dynamic else enum expect external false field file final finally for fun get if import in infix init inline inner interface internal is it lateinit noinline null object open operator out override package param private property protected public receiver reified return sealed set setparam super suspend tailrec this throw true try typealias val var vararg when where while",
      },
      swift: {
        name: "Swift",
        words:
          "#available #colorLiteral #column #dsohandle #else #elseif #endif #error #file #fileID #fileLiteral #filePath #function #if #imageLiteral #keyPath #line #selector #sourceLocation #warning Any Protocol Self Type __consuming __owned actor as assignment associatedtype associativity async await break case catch class continue convenience default defer deinit didSet do dynamic dynamicType else enum extension fallthrough false fileprivate final for func get guard higherThan if import in indirect infix init inout internal is isolated lazy left let lowerThan mutating nil none nonisolated nonmutating open operator optional override postfix precedence precedencegroup prefix private protocol public repeat required rethrows return right safe self set some static struct subscript super switch throw throws true try typealias unowned unsafe var weak where while willSet",
      },
      ruby: {
        name: "Ruby",
        words:
          "BEGIN END __ENCODING__ __FILE__ __LINE__ alias and attr_reader begin break case class def do else elsif end ensure extend false for if in include module new next nil not or private private_class_method protected protected_class_method public redo require rescue retry return self super then true undef unless until when while yield",
      },
      php: {
        name: "PHP",
        words:
          "__CLASS__ __DIR__ __FILE__ __FUNCTION__ __LINE__ __METHOD__ __NAMESPACE__ __TRAIT__ __construct abstract and array as break callable case catch cfunction class clone const continue declare default die do echo else elseif empty enddeclare endfor endforeach endif endswitch endwhile eval exit extends false final for foreach function global goto if implements include include_once instanceof insteadof interface isset list namespace new null object old_function or print private protected public require require_once resource return static switch throw trait true try unset use var while xor yield",
      },
      lua: {
        name: "Lua",
        words:
          "and break do else elseif end false for function goto if in local nil not or repeat return then true until while",
      },
      r: {
        name: "R",
        words:
          "FALSE Inf LETTERS NA NA_character_ NA_complex_ NA_integer_ NA_real_ NULL NaN TRUE array attach break category character complex detach double else factor for function if in integer letters library list logical matrix next numeric pi repeat require return source vector while",
      },
      dart: {
        name: "Dart",
        words:
          "Function String abstract as assert async await bool break case catch class const continue covariant default deferred do double dynamic else enum export extends external factory false final finally for get hide if implements import in int interface is library mixin new null on operator part rethrow return set show static super switch sync this throw true try typedef var void while with yield",
      },
      scala: {
        name: "Scala",
        words:
          "abstract as asInstanceOf catch class classOf def derives do else end enum export extends extension false final finally for forSome foreach given if implicit import inline isInstanceOf lazy macro match new null object on opaque open override package private protected return sealed super then this throw trait transparent true try type until using val var while with yield",
      },
      sql: {
        name: "SQL",
        words:
          "abort abs absolute acos action ada add after all allocate alter always analyze and any app_name applock_mode applock_test are as asc ascii asin assemblyproperty assertion asymkey_id asymkeyproperty at atan atn2 attach authorization autoincrement avg backup before begin between binary_checksum bit bit_length both break browse bulk by cascade cascaded case cast catalog ceiling cert_id certencoded certprivatekey certproperty change_tracking_context change_tracking_current_version change_tracking_is_column_in_mask change_tracking_min_valid_version changetable char char_length character character_length charindex check checkpoint checksum checksum_agg choose close clustered coalesce col_length col_name collate collation collationproperty column columnproperty columns_updated commit compute concat conflict connect connection connectionproperty constraint constraints contains containstable context_info continue convert corresponding cos cot count count_big create cross crypt_gen_random cume_dist current current_date current_request_id current_time current_timestamp current_user cursor cursor_status database database_principal_id databasepropertyex datalength date dateadd datediff datefromparts datename datepart datetime2fromparts datetimefromparts datetimeoffsetfromparts day db_id db_name dbcc deallocate dec decimal declare decryptbyasymkey decryptbycert decryptbykey decryptbykeyautoasymkey decryptbykeyautocert decryptbypassphrase default deferrable deferred degrees delete dense_rank deny desc describe descriptor detach diagnostics difference disconnect disk distinct distributed do domain double drop dump each else encryptbyasymkey encryptbycert encryptbykey encryptbypassphrase end end-exec eomonth errlvl error_line error_message error_number error_procedure error_severity error_state escape eventdata except exception exclude exclusive exec execute exists exit exp explain external extract fail false federation_filtering_value fetch file file_id file_idex file_name filegroup_id filegroup_name filegroupproperty fileproperty filetablerootpath fillfactor filter first first_value float floor following for foreign format formatmessage fortran found freetext freetexttable from full fulltextcatalogproperty fulltextserviceproperty function generated get get_filestream_transaction_context get_transmission_status getansinull getdate getfilenamespacepath getpathlocator getutcdate glob global go goto grant group grouping grouping_id groups has_dbaccess has_perms_by_name hashbytes having holdlock host_id host_name hour ident_current ident_incr ident_seed identity identity_insert identitycol if ignore iif immediate in include index index_col indexed indexkey_property indexproperty indicator initially inner input insensitive insert instead int integer intersect interval into is is_member is_objectsigned is_rolemember is_srvrolemember isdate isnull isnumeric isolation join key key_guid key_id key_name kill lag language last last_value lead leading left len level like limit lineno load local log log10 loginproperty lower ltrim match materialized max merge min min_active_rowversion minute module month names national natural nchar newid newsequentialid next no nocheck nonclustered none not nothing notnull ntile null nullif nulls numeric object_definition object_id object_name object_schema_name objectproperty objectpropertyex octet_length of off offset offsets on only open opendatasource openquery openrowset openxml option or order original_db_name original_login others outer output over overlaps pad parse parsename partial partition pascal pathname patindex percent percent_rank percentile_cont percentile_disc permissions pi pivot plan position power pragma preceding precision prepare preserve primary print prior privileges proc procedure public publishingservername pwdcompare pwdencrypt query quotename radians raise raiserror rand range rank read readtext real reconfigure recursive references regexp reindex relative release rename replace replicate replication restore restrict return returning reverse revert revoke right rollback round row row_number rowcount rowcount_big rowguidcol rows rtrim rule save savepoint schema schema_id schema_name scope_identity scroll second section securityaudit select semantickeyphrasetable semanticsimilaritydetailstable semanticsimilaritytable serverproperty session session_user sessionproperty set setuser shutdown sign signbyasymkey signbycert sin size smalldatetimefromparts smallint some soundex space sql sql_variant_property sqlca sqlcode sqlerror sqlstate sqlwarning sqrt square statistics stats_date stdev stdevp str stuff substring sum suser_id suser_name suser_sid suser_sname switchoffset symkeyproperty sysdatetime sysdatetimeoffset system_user sysutcdatetime table tablesample tan temp temporary tertiary_weights textptr textsize textvalid then ties time timefromparts timestamp timezone_hour timezone_minute to todatetimeoffset top trailing tran transaction translate translation trigger trigger_nestlevel trim true truncate try_cast try_convert try_parse tsequal type_id type_name typeproperty unbounded unicode union unique unknown unpivot update updatetext upper usage use user user_id user_name using vacuum value values var varchar varp varying verifysignedbyasymkey verifysignedbycert view virtual waitfor when whenever where while window with without work write writetext xact_state year zone",
        anyCase: true,
      },
      mysql: {
        name: "MySQL",
        words:
          "abs accessible acos add adddate addtime aes_decrypt aes_encrypt all alter analyze and any_value area as asbinary asc ascii asensitive asin astext aswkb aswkt asymmetric_decrypt asymmetric_derive asymmetric_encrypt asymmetric_sign asymmetric_verify atan atan2 avg before benchmark between bigint bin binary bit_and bit_count bit_length bit_or bit_xor blob both buffer by call cascade case cast ceil ceiling centroid change char char_length character character_length charset check coalesce coercibility collate collation column compress concat concat_ws condition connection_id constraint contains continue conv convert convert_tz convexhull cos cot count crc32 create create_asymmetric_priv_key create_asymmetric_pub_key create_dh_parameters create_digest cross crosses cube cume_dist curdate current_date current_role current_time current_timestamp current_user cursor curtime database databases date date_add date_format date_sub datediff day day_hour day_microsecond day_minute day_second dayname dayofmonth dayofweek dayofyear dec decimal declare decode default degrees delayed delete dense_rank des_decrypt des_encrypt desc describe deterministic dimension disjoint distance distinct distinctrow div double drop dual each else elseif elt empty enclosed encode encrypt endpoint envelope equals escaped except exists exit exp explain export_set exteriorring extract extractvalue false fetch field find_in_set first_value float float4 float8 floor for force foreign format format_bytes format_pico_time found_rows from from_base64 from_days from_unixtime fulltext function gen_range gen_rnd_email gen_rnd_pan gen_rnd_ssn gen_rnd_us_phone generated geomcollection geomcollfromtext geomcollfromwkb geometrycollection geometrycollectionfromtext geometrycollectionfromwkb geometryfromtext geometryfromwkb geometryn geometrytype geomfromtext geomfromwkb get get_format get_lock glength grant greatest group group_concat grouping groups gtid_subset gtid_subtract having hex high_priority hour hour_microsecond hour_minute hour_second icu_version if ifnull ignore in index inet6_aton inet6_ntoa inet_aton inet_ntoa infile inner inout insensitive insert instr int int1 int2 int3 int4 int8 integer interiorringn intersects interval into io_after_gtids io_before_gtids is is_free_lock is_ipv4 is_ipv4_compat is_ipv4_mapped is_ipv6 is_used_lock is_uuid isclosed isempty isnull issimple iterate join json_append json_array json_array_append json_array_insert json_arrayagg json_contains json_contains_path json_depth json_extract json_insert json_keys json_length json_merge json_merge_patch json_merge_preserve json_object json_objectagg json_overlaps json_pretty json_quote json_remove json_replace json_schema_valid json_schema_validation_report json_search json_set json_storage_free json_storage_size json_table json_type json_unquote json_valid key keys kill lag last_day last_insert_id last_value lateral lcase lead leading least leave left length like limit linear linefromtext linefromwkb lines linestring linestringfromtext linestringfromwkb ln load load_file localtime localtimestamp locate lock log log10 log2 long longblob longtext loop low_priority lower lpad ltrim make_set makedate maketime mask_inner mask_outer mask_pan mask_pan_relaxed mask_ssn master_bind master_pos_wait master_ssl_verify_server_cert match max maxvalue mbrcontains mbrcoveredby mbrcovers mbrdisjoint mbrequal mbrequals mbrintersects mbroverlaps mbrtouches mbrwithin md5 mediumblob mediumint mediumtext microsecond mid middleint min minute minute_microsecond minute_second mlinefromtext mlinefromwkb mod modifies month monthname mpointfromtext mpointfromwkb mpolyfromtext mpolyfromwkb multilinestring multilinestringfromtext multilinestringfromwkb multipoint multipointfromtext multipointfromwkb multipolygon multipolygonfromtext multipolygonfromwkb name_const natural no_write_to_binlog not now nth_value ntile null nullif numeric numgeometries numinteriorrings numpoints oct octet_length of old_password on optimize optimizer_costs option optionally or ord order out outer outfile over overlaps partition password percent_rank period_add period_diff pi point pointfromtext pointfromwkb pointn polyfromtext polyfromwkb polygon polygonfromtext polygonfromwkb position pow power precision primary procedure ps_current_thread_id ps_thread_id purge quarter quote radians rand random_bytes range rank read read_write reads real recursive references regexp regexp_instr regexp_like regexp_replace release release_all_locks release_lock rename repeat replace require resignal restrict return reverse revoke right rlike roles_graphml round row row_count row_number rows rpad rtrim schema schemas sec_to_time second second_microsecond select sensitive separator session_user set sha sha1 sha2 show sign signal sin sleep smallint soundex source_pos_wait space spatial specific sql sql_big_result sql_calc_found_rows sql_small_result sqlexception sqlstate sqlwarning sqrt srid ssl st_area st_asbinary st_asgeojson st_astext st_aswkb st_aswkt st_buffer st_buffer_strategy st_centroid st_collect st_contains st_convexhull st_crosses st_difference st_dimension st_disjoint st_distance st_distance_sphere st_endpoint st_envelope st_equals st_exteriorring st_frechetdistance st_geohash st_geomcollfromtext st_geomcollfromtxt st_geomcollfromwkb st_geometrycollectionfromtext st_geometrycollectionfromwkb st_geometryfromtext st_geometryfromwkb st_geometryn st_geometrytype st_geomfromgeojson st_geomfromtext st_geomfromwkb st_hausdorffdistance st_interiorringn st_intersection st_intersects st_isclosed st_isempty st_issimple st_isvalid st_latfromgeohash st_length st_linefromtext st_linefromwkb st_lineinterpolatepoint st_lineinterpolatepoints st_linestringfromtext st_linestringfromwkb st_longfromgeohash st_longitude st_makeenvelope st_mlinefromtext st_mlinefromwkb st_mpointfromtext st_mpointfromwkb st_mpolyfromtext st_mpolyfromwkb st_multilinestringfromtext st_multilinestringfromwkb st_multipointfromtext st_multipointfromwkb st_multipolygonfromtext st_multipolygonfromwkb st_numgeometries st_numinteriorring st_numinteriorrings st_numpoints st_overlaps st_pointatdistance st_pointfromgeohash st_pointfromtext st_pointfromwkb st_pointn st_polyfromtext st_polyfromwkb st_polygonfromtext st_polygonfromwkb st_simplify st_srid st_startpoint st_swapxy st_symdifference st_touches st_transform st_union st_validate st_within st_x st_y starting startpoint statement_digest statement_digest_text std stddev stddev_pop stddev_samp stored str_to_date straight_join strcmp subdate substr substring substring_index subtime sum sysdate system system_user table tan terminated then time time_format time_to_sec timediff timestamp timestampadd timestampdiff tinyblob tinyint tinytext to to_base64 to_days to_seconds touches trailing trigger trim true truncate ucase uncompress uncompressed_length undo unhex union unique unix_timestamp unlock unsigned update updatexml upper usage use user using utc_date utc_time utc_timestamp uuid uuid_short uuid_to_bin validate_password_strength values var_pop var_samp varbinary varchar varcharacter variance varying version virtual wait_for_executed_gtid_set wait_until_sql_thread_after_gtids week weekday weekofyear weight_string when where while window with within write xor year year_month yearweek zerofill",
        anyCase: true,
      },
      shell: {
        name: "Shell",
        words:
          "ab awk bash beep cat cc cd chmod chown chroot clear cp curl cut diff do done echo elif else esac exit export fi fil fin find for function gawk gcc get git grep hg if in kill killall ln ls make mkdir mv nc node npm openssl ping ps restart rm rmdir sed service set sh shopt shred sleep sort source ssh start stop su sudo svn tee telnet then top touch unset until vi vim wall wc wget while who write yes zsh",
      },
      powershell: {
        name: "PowerShell",
        words:
          "begin break catch class configuration continue data define do dynamicparam else elseif end exit filter finally for foreach from function if in inlinescript parallel param process return sequence switch throw trap try until using var while workflow",
        anyCase: true,
      },
    },
    aliases: {
      py: "python",
      python3: "python",
      js: "javascript",
      jsx: "javascript",
      mjs: "javascript",
      cjs: "javascript",
      node: "javascript",
      ts: "typescript",
      tsx: "typescript",
      c: "cpp",
      "c++": "cpp",
      cc: "cpp",
      cxx: "cpp",
      h: "cpp",
      hpp: "cpp",
      cs: "csharp",
      "c#": "csharp",
      golang: "go",
      rs: "rust",
      kt: "kotlin",
      kts: "kotlin",
      rb: "ruby",
      postgresql: "sql",
      postgres: "sql",
      pgsql: "sql",
      sqlite: "sql",
      tsql: "sql",
      plsql: "sql",
      mariadb: "mysql",
      sh: "shell",
      bash: "shell",
      zsh: "shell",
      shellscript: "shell",
      console: "shell",
      ps1: "powershell",
      pwsh: "powershell",
      ps: "powershell",
    },
  };
})(typeof window !== "undefined" ? window : globalThis);
