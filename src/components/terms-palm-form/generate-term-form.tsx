"use client"

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DeviceModel } from "./device-models";
import { IoDocumentText } from "react-icons/io5";
import { FaMobileScreen } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import {
  LuChevronsUpDown,
  LuCheck
} from "react-icons/lu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "../ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { ComponentsComputerOptions } from "./components";
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";
import { Switch } from "../ui/switch";

const MESSAGE_NOEMPTY_EMPLOYEE = "Employee name cannot be empty";
const MESSAGE_NOEMPTY_CPF = "CPF cannot be empty";
const MESSAGE_NOEMPTY_DEVICE_MODEL = "Device model cannot be empty";
const MESSAGE_NOEMPTY_IMEI_SERIAL_DEVICE = "IMEI/Serial device cannot be empty";

const generateTermFormSchema = z.object({
  employee: z
    .string()
    .nonempty({ message: MESSAGE_NOEMPTY_EMPLOYEE })
    .min(3, { message: "Employee name must be at least 3 characters long" }),
  cpf: z
    .string()
    .nonempty({ message: MESSAGE_NOEMPTY_CPF })
    .length(11, { message: "CPF must be exactly 11 characters long" }),
  deviceModel: z.string().nonempty({ message: MESSAGE_NOEMPTY_DEVICE_MODEL }),
  imeiSerialDevice: z
    .string()
    .nonempty({ message: MESSAGE_NOEMPTY_IMEI_SERIAL_DEVICE })
    .length(15, { message: "IMEI/Serial device must be exactly 15 characters long" }),
  componentsComputer: z.array(z.string()),
  isBrokenScreen: z.boolean().default(false).optional(),
});

type GenerateTermFormSchema = z.infer<typeof generateTermFormSchema>;

export function GenerateTermForm() {
  const generateTermForm = useForm<GenerateTermFormSchema>({
    resolver: zodResolver(generateTermFormSchema),
    defaultValues: {
      employee: "",
      cpf: "",
      deviceModel: "",
      imeiSerialDevice: "",
      componentsComputer: [],
      isBrokenScreen: false,
    },
  });

  function handleSubmit(data: GenerateTermFormSchema) {
    toast("Termo gerado com sucesso!", {
      description: (
        <pre className="mt-2 w-[310px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      duration: 7000,
    });
  };

  return (
    <Form {...generateTermForm}>
      <form onSubmit={generateTermForm.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={generateTermForm.control}
          name="employee"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Funcionário</FormLabel>
              <FormControl>
                <Input placeholder="Insira o nome completo do funcionário" {...field}></Input>
              </FormControl>
              <FormDescription>
                Nome completo do funcionário que irá entregar o dispositivo.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={generateTermForm.control}
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">CPF</FormLabel>
              <FormControl>
                <Input placeholder="Insira o CPF do funcionário" {...field}></Input>
              </FormControl>
              <FormDescription>CPF do funcionário que irá entregar o dispositivo.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={generateTermForm.control}
          name="deviceModel"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Modelo do Dispositivo</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline" role="combobox" className={
                      cn("w-[200px] justify-between", !field.value && "text-muted-foreground")}>
                      {field.value
                        ? DeviceModel.find((device) => device.value === field.value)?.label
                        : "Selecionar modelo..."}
                      <LuChevronsUpDown className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Procurar modelo..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>Modelo não encontrado.</CommandEmpty>
                      <CommandGroup>
                        {DeviceModel.map((device) => (
                          <CommandItem
                            key={device.id}
                            value={device.value}
                            onSelect={() => {
                              generateTermForm.setValue("deviceModel", device.value)
                            }}
                          >
                            {device.label}
                            <LuCheck
                              className={cn(
                                "ml-auto",
                                device.value === field.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>Modelo do dispositivo que será entregue.</FormDescription>
              <FormMessage />
            </FormItem>
          )
          }
        />
        < FormField
          control={generateTermForm.control}
          name="imeiSerialDevice"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">IMEI/Série do Dispositivo</FormLabel>
              <FormControl>
                <Input placeholder="Insira o IMEI/Série do dispositivo" {...field}></Input>
              </FormControl>
              <FormDescription>IMEI ou número de série do dispositivo que será entregue.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        < FormField
          control={generateTermForm.control}
          name="componentsComputer"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="font-bold">Componentes</FormLabel>
              </div>
              {ComponentsComputerOptions.map((component) => (
                <FormField
                  key={component.id}
                  control={generateTermForm.control}
                  name="componentsComputer"
                  render={({ field }) => (
                    <FormItem key={component.id} className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(component.id)}
                          onCheckedChange={(checked) => {
                            return checked ? field.onChange([...field.value, component.id]) : field.onChange(field.value?.filter((item) => item !== component.id));
                          }}
                        ></Checkbox>
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        {component.label}
                      </FormLabel>
                    </FormItem>
                  )}
                ></FormField>
              ))}
            </FormItem>
          )}
        />
        < FormField
          control={generateTermForm.control}
          name="isBrokenScreen"
          render={() => (
            <div>
              <h3 className="mb-4 text-lg font-bold">Informações Adicionais</h3>
              <div className="space-y-4">
                <FormField
                  control={generateTermForm.control}
                  name="isBrokenScreen"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel className="font-bold">
                          <FaMobileScreen className="mr-2 inline-block" />
                          Tela Quebrada
                        </FormLabel>
                        <FormDescription>
                          Se o dispositivo tem a tela quebrada, selecione esta opção.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
        />
        <Button type="submit" className="hover:cursor-pointer">
          <IoDocumentText className="mr-2" />
          Gerar Termo
        </Button >
      </form >
    </Form >
  )
}